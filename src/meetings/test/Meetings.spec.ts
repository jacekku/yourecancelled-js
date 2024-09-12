import { randomUUID } from 'crypto';
import { Meeting, MeetingResult } from '../Meeting';
import { CreateMeeting } from '../Meetings.commands';

function expectSuccess(result: MeetingResult) {
  expect(result.errors).toHaveLength(0);
  expect(result.events).not.toHaveLength(0);
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
});
