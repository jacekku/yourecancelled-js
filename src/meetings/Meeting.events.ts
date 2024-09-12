import { Event } from '@event-driven-io/emmett';
import { UUID } from 'crypto';

export type MeetingCreated = Event<
  'MeetingCreated',
  {
    actorId: UUID;
    creatorId: UUID;
    meetingId: UUID;
    timestamp: number;
  }
>;

export type ParticipantAdded = Event<
  'ParticipantAdded',
  {
    actorId: UUID;
    participantId: UUID;
    meetingId: UUID;
    timestamp: number;
  }
>;

export type AttendanceCancelled = Event<
  'AttendanceCancelled',
  {
    actorId: UUID;
    meetingId: UUID;
    timestamp: number;
  }
>;

export type MeetingCancelled = Event<
  'MeetingCancelled',
  {
    meetingId: UUID;
    timestamp: number;
  }
>;

export type MeetingEvent =
  | MeetingCreated
  | ParticipantAdded
  | AttendanceCancelled
  | MeetingCancelled;
