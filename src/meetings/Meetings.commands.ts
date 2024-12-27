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

export type RemoveParticipant = Command<
  'RemoveParticipant',
  {
    actorId: ActorId;
    participantId: ActorId;
  }
>;

export type CancelAttendance = Command<
  'CancelAttendance',
  { actorId: ActorId; meetingId: MeetingId }
>;

export type ChangeMeetingData = Command<
  'ChangeMeetingData',
  {
    actorId: ActorId;
    meetingId: MeetingId;
    date: Date | undefined;
    name: string | undefined;
  }
>;

export type MeetingCommand =
  | CreateMeeting
  | AddParticipant
  | CancelAttendance
  | ChangeMeetingData
  | RemoveParticipant;
