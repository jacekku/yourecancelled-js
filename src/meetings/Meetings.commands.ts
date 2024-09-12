import { Command } from '@event-driven-io/emmett';
import { UUID } from 'crypto';

export type CreateMeeting = Command<
  'CreateMeeting',
  {
    actorId: UUID;
  }
>;

export type AddParticipant = Command<
  'AddParticipant',
  {
    actorId: UUID;
    participantId: UUID;
    meetingId: UUID;
  }
>;

export type CancelAttendance = Command<
  'CancelAttendance',
  {
    actorId: UUID;
    meetingId: UUID;
  }
>;

export type MeetingCommand = CreateMeeting | AddParticipant | CancelAttendance;
