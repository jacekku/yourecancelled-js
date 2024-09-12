import { randomUUID, UUID } from 'crypto';
import { MeetingEvent } from './Meeting.events';
import {
  AddParticipant,
  CancelAttendance,
  CreateMeeting,
  MeetingCommand,
} from './Meetings.commands';

export type MeetingResult = {
  events: MeetingEvent[];
  errors: MeetingError[];
  meeting?: Meeting;
};

export type MeetingError = unknown;

export class Meeting {
  protected creator: UUID;
  protected id: UUID;
  cancelledParticipants = [];
  participants = [];

  public static get new() {
    return new Meeting();
  }

  public handle(command: MeetingCommand): MeetingResult {
    switch (command.type) {
      case 'CreateMeeting':
        return this.createMeeting(command);
      case 'AddParticipant':
        return this.addParticipant(command);
      case 'CancelAttendance':
        return this.cancelAttendance(command);
      default:
        return this.result({});
    }
  }

  private cancelAttendance(command: CancelAttendance): MeetingResult {
    const actorId = command.data.actorId;
    const meetingId = this.id;
    const events: MeetingEvent[] = [
      {
        type: 'AttendanceCancelled',
        data: {
          actorId,
          meetingId,
          timestamp: Date.now(),
        },
      },
    ];
    if (this.cancelledParticipants.length === this.participants.length) {
      events.push({
        type: 'MeetingCancelled',
        data: {
          meetingId: this.id,
          timestamp: Date.now(),
        },
      });
    }

    this.apply(events);

    return this.result({ events });
  }

  private createMeeting(command: CreateMeeting): MeetingResult {
    const { actorId } = command.data;
    const meetingId = randomUUID();
    const events: MeetingEvent[] = [
      {
        type: 'MeetingCreated',
        data: { actorId, creatorId: actorId, meetingId, timestamp: Date.now() },
      },
    ];

    this.apply(events);

    return this.result({ events });
  }

  private addParticipant(command: AddParticipant): MeetingResult {
    const { actorId, participantId } = command.data;

    const events: MeetingEvent[] = [
      {
        type: 'ParticipantAdded',
        data: {
          actorId,
          participantId,
          meetingId: this.id,
          timestamp: Date.now(),
        },
      },
    ];

    this.apply(events);

    return this.result({ events });
  }

  private applyEvent(event: MeetingEvent) {
    switch (event.type) {
      case 'MeetingCreated': {
        this.creator = event.data.creatorId;
        this.id = event.data.meetingId;
        return this;
      }
      case 'ParticipantAdded': {
        this.participants.push(event.data.participantId);
        return this;
      }
      case 'AttendanceCancelled': {
        this.cancelledParticipants.push(event.data.actorId);
        return this;
      }
      default:
        return this;
    }
  }

  private result(data: {
    events?: MeetingEvent[];
    errors?: MeetingError[];
    meeting?: Meeting;
  }): MeetingResult {
    return {
      errors: data.errors || [],
      events: data.events || [],
      meeting: data.meeting || this,
    };
  }

  public apply(events: MeetingEvent[]): Meeting {
    events.forEach((event) => this.applyEvent(event));
    return this;
  }
}
