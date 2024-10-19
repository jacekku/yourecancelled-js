import { Flavour } from '@event-driven-io/emmett';
import { randomUUID } from 'crypto';
import { DomainError } from '../common/models';
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

export type ActorId = Flavour<string, 'MeetingActorId'>;
export type MeetingId = Flavour<string, 'MeetingId'>;

type ActorNotCreator = DomainError<
  'ActorNotCreator',
  {
    actorId: ActorId;
    meetingId: MeetingId;
  }
>;

type ParticipantAlreadyAdded = DomainError<
  'ParticipantAlreadyAdded',
  {
    actorId: ActorId;
    participantId: ActorId;
    meetingId: MeetingId;
  }
>;

type MeetingCancelledError = DomainError<
  'MeetingCancelled',
  {
    actorId: ActorId;
    meetingId: MeetingId;
  }
>;

export type MeetingError =
  | ActorNotCreator
  | ParticipantAlreadyAdded
  | MeetingCancelledError;

export enum MeetingStatus {
  Active,
  Cancelled,
}

export class Meeting {
  protected creator: ActorId;
  protected id: MeetingId;
  protected status: MeetingStatus;

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
    const meetingId = this.id;

    const errors: MeetingError[] = [];
    if (actorId !== this.creator) {
      errors.push({
        type: 'ActorNotCreator',
        data: { actorId, meetingId },
      });
    }
    if (this.participants.includes(participantId)) {
      errors.push({
        type: 'ParticipantAlreadyAdded',
        data: { actorId, meetingId, participantId },
      });
    }
    if (this.status === MeetingStatus.Cancelled) {
      errors.push({
        type: 'MeetingCancelled',
        data: { actorId, meetingId },
      });
    }

    if (errors.length > 0) {
      return this.result({ errors });
    }

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
        this.status = MeetingStatus.Active;
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
      case 'MeetingCancelled': {
        this.status = MeetingStatus.Cancelled;
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
