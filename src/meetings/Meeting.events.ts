import { Event } from '@event-driven-io/emmett';
import { ActorId, MeetingId } from './Meeting';

export type MeetingCreated = Event<
  'MeetingCreated',
  {
    actorId: ActorId;
    creatorId: ActorId;
    meetingId: MeetingId;
    timestamp: number;
  }
>;

export type ParticipantAdded = Event<
  'ParticipantAdded',
  {
    actorId: ActorId;
    participantId: ActorId;
    meetingId: MeetingId;
    timestamp: number;
  }
>;

export type AttendanceCancelled = Event<
  'AttendanceCancelled',
  {
    actorId: ActorId;
    meetingId: MeetingId;
    timestamp: number;
  }
>;

export type MeetingCancelled = Event<
  'MeetingCancelled',
  {
    meetingId: MeetingId;
    timestamp: number;
  }
>;

export type MeetingDataChanged = Event<
  'MeetingDataChanged',
  {
    actorId: ActorId;
    meetingId: MeetingId;
    timestamp: number;
    name?: string;
    date?: Date;
  }
>;

export type ParticipantRemoved = Event<
  'ParticipantRemoved',
  {
    actorId: ActorId;
    participantId: ActorId;
    meetingId: MeetingId;
    timestamp: number;
  }
>;

export type MeetingEvent =
  | MeetingCreated
  | ParticipantAdded
  | AttendanceCancelled
  | MeetingCancelled
  | MeetingDataChanged
  | ParticipantRemoved;
