import { Command } from '@event-driven-io/emmett';
import { ActorId, MeetingId } from './Meeting';

export type CreateMeeting = Command<
  'CreateMeeting',
  {
    actorId: ActorId;
  }
>;

export type AddParticipant = Command<
  'AddParticipant',
  {
    actorId: ActorId;
    participantId: ActorId;
    meetingId: MeetingId;
  }
>;

export type CancelAttendance = Command<
  'CancelAttendance',
  { actorId: ActorId; meetingId: MeetingId }
>;

export type MeetingCommand = CreateMeeting | AddParticipant | CancelAttendance;
