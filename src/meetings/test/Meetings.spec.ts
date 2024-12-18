import { randomUUID } from 'crypto';
import { Meeting, MeetingResult } from '../Meeting';
import { MeetingDataChanged } from '../Meeting.events';
import { CreateMeeting } from '../Meetings.commands';

function expectSuccess(result: MeetingResult) {
  expect(result.errors).toHaveLength(0);
  expect(result.events).not.toHaveLength(0);
}

function expectError(result: MeetingResult) {
  expect(result.errors).not.toHaveLength(0);
  expect(result.events).toHaveLength(0);
}

function getUUIDs() {
  return {
    actorId: randomUUID(),
    meetingId: randomUUID(),
    participantId: randomUUID(),
    timestamp: Date.now(),
  };
}

describe('Meetings', () => {
  describe('Main Flow', () => {
    test('User can create a Meeting', () => {
      const command: CreateMeeting = {
        type: 'CreateMeeting',
        data: { actorId: randomUUID() },
      };
      const result = Meeting.new.handle(command);

      expect(result.errors).toHaveLength(0);
      expect(result.events).toHaveLength(1);
    });

    test('User can add Participants to Meeting', () => {
      const actorId = randomUUID();
      const meetingId = randomUUID();
      const meeting = Meeting.new.apply([
        {
          type: 'MeetingCreated',
          data: {
            actorId,
            creatorId: actorId,
            meetingId,
            timestamp: Date.now(),
          },
        },
      ]);

      const participantId = randomUUID();
      const result = meeting.handle({
        type: 'AddParticipant',
        data: { actorId, participantId, meetingId },
      });

      expect(result.errors).toHaveLength(0);
      expect(result.events).toHaveLength(1);
    });

    test('Participants can Cancel their attendance', () => {
      const actorId = randomUUID();
      const participantId = randomUUID();
      const meetingId = randomUUID();
      const meeting = Meeting.new.apply([
        {
          type: 'MeetingCreated',
          data: {
            actorId,
            creatorId: actorId,
            meetingId,
            timestamp: Date.now(),
          },
        },
        {
          type: 'ParticipantAdded',
          data: { actorId, participantId, meetingId, timestamp: Date.now() },
        },
      ]);

      const result = meeting.handle({
        type: 'CancelAttendance',
        data: {
          actorId: participantId,
          meetingId,
        },
      });

      expectSuccess(result);
    });

    test('When all Participants Cancel their attendance the whole meeting is Cancelled', () => {
      const actorId = randomUUID();
      const participantId = randomUUID();
      const meetingId = randomUUID();
      const timestamp = Date.now();
      const meeting = Meeting.new.apply([
        {
          type: 'MeetingCreated',
          data: { actorId, creatorId: actorId, meetingId, timestamp },
        },
        {
          type: 'ParticipantAdded',
          data: { actorId, participantId, meetingId, timestamp },
        },
        {
          type: 'AttendanceCancelled',
          data: { actorId, meetingId, timestamp },
        },
      ]);

      const result = meeting.handle({
        type: 'CancelAttendance',
        data: { actorId, meetingId },
      });

      expectSuccess(result);
      expect(result.events).toHaveLength(2);
    });
  });

  describe('Creator can change Meeting data', () => {
    test('Meeting name', () => {
      const { actorId, meetingId, timestamp } = getUUIDs();
      const meeting = Meeting.new.apply([
        {
          type: 'MeetingCreated',
          data: {
            actorId,
            creatorId: actorId,
            meetingId,
            timestamp: Date.now(),
          },
        },
      ]);

      const result = meeting.handle({
        type: 'ChangeMeetingData',
        data: { actorId, meetingId, name: 'New Name', date: null },
      });
      expectSuccess(result);
      const event = result.events.at(0) as MeetingDataChanged;
      expect(event.type).toBe('MeetingDataChanged');
      expect(event.data.name).toBe('New Name');
    });
  });

  describe('Validation', () => {
    test('Only creator can add Participants', () => {
      const actorId = randomUUID();
      const meetingId = randomUUID();
      const meeting = Meeting.new.apply([
        {
          type: 'MeetingCreated',
          data: {
            actorId,
            creatorId: actorId,
            meetingId,
            timestamp: Date.now(),
          },
        },
      ]);

      const result = meeting.handle({
        type: 'AddParticipant',
        data: { actorId: randomUUID(), meetingId, participantId: randomUUID() },
      });

      expectError(result);
      expect(result.errors[0].type).toBe('ActorNotCreator');
    });

    test('Participant can only be added once', () => {
      const { actorId, meetingId, participantId, timestamp } = getUUIDs();

      const meeting = Meeting.new.apply([
        {
          type: 'MeetingCreated',
          data: { actorId, creatorId: actorId, meetingId, timestamp },
        },
        {
          type: 'ParticipantAdded',
          data: { actorId, meetingId, participantId, timestamp },
        },
      ]);

      const result = meeting.handle({
        type: 'AddParticipant',
        data: { actorId, meetingId, participantId },
      });

      expectError(result);
    });

    test('After Meeting is Cancelled, Participants cannot be added', () => {
      const { actorId, meetingId, timestamp } = getUUIDs();

      const meeting = Meeting.new.apply([
        {
          type: 'MeetingCreated',
          data: { actorId, creatorId: actorId, meetingId, timestamp },
        },
        { type: 'MeetingCancelled', data: { meetingId, timestamp } },
      ]);

      const result = meeting.handle({
        type: 'AddParticipant',
        data: { actorId, meetingId, participantId: actorId },
      });

      expectError(result);
    });
  });
});
