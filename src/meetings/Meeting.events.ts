import { Event } from '@event-driven-io/emmett';
import { ActorId, MeetingId } from './Meeting';

export type MeetingCreated = Event<
  'MeetingCreated',
  {
    actorId: ActorId;
    creatorId: ActorId;
    meetingId: MeetingId;
    timestamp: number;
  },
  { module: 'Meetings' }
>;

export type ParticipantAdded = Event<
  'ParticipantAdded',
  {
    actorId: ActorId;
    participantId: ActorId;
    meetingId: MeetingId;
    timestamp: number;
  },
  { module: 'Meetings' }
>;

export type AttendanceCancelled = Event<
  'AttendanceCancelled',
  {
    actorId: ActorId;
    meetingId: MeetingId;
    timestamp: number;
  },
  { module: 'Meetings' }
>;

export type MeetingCancelled = Event<
  'MeetingCancelled',
  {
    meetingId: MeetingId;
    timestamp: number;
  },
  { module: 'Meetings' }
>;

export type MeetingDataChanged = Event<
  'MeetingDataChanged',
  {
    actorId: ActorId;
    meetingId: MeetingId;
    timestamp: number;
    name?: string;
    date?: Date;
  },
  { module: 'Meetings' }
>;

export type ParticipantRemoved = Event<
  'ParticipantRemoved',
  {
    actorId: ActorId;
    participantId: ActorId;
    meetingId: MeetingId;
    timestamp: number;
  },
  { module: 'Meetings' }
>;

export type MeetingEvent =
  | MeetingCreated
  | ParticipantAdded
  | AttendanceCancelled
  | MeetingCancelled
  | MeetingDataChanged
  | ParticipantRemoved;
