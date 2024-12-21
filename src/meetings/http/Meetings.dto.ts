import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { ActorId, MeetingId } from '../Meeting';
import { MeetingEvent } from '../Meeting.events';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  public userId: string;
  @IsNotEmpty()
  public name: string;
  @IsDateString()
  public datetime: Date;
}

export class EventDto {
  public id: MeetingId;
  public authorId: string;
  public status: EventStatusDto;
  public date: Date;
  public name: string;
  public participants: ParticipantDto[];

  static from(events: MeetingEvent[]): EventDto {
    return events.reduce<EventDto>(EventDto.evolve, new EventDto());
  }

  static evolve(state: EventDto, event: MeetingEvent): EventDto {
    const { type, data } = event;
    switch (type) {
      case 'MeetingCreated':
        state.id = data.meetingId;
        state.authorId = data.creatorId;
        state.status = EventStatusDto.ATTENDING;
        state.participants = [];
        state.name = '';
        state.date = new Date(event.data.timestamp);
        return state;
      case 'ParticipantAdded':
        state.participants.push(ParticipantDto.from(data.participantId));
        return state;
      case 'AttendanceCancelled':
        return state;
      case 'MeetingCancelled':
        state.status = EventStatusDto.CANCELLED;
        return state;
      case 'MeetingDataChanged':
        state.date = data.date;
        state.name = data.name;
        return state;
    }
  }
}

export class ParticipantDto {
  userId: ActorId;

  static from(id: ActorId): ParticipantDto {
    return { userId: id };
  }
}

export enum ParticipantStatusDto {
  ATTENDING = 'ATTENDING',
  CANCELLED = 'CANCELLED',
}

export enum EventStatusDto {
  EMPTY = 'EMPTY',
  ATTENDING = 'ATTENDING',
  CANCELLED = 'CANCELLED',
}
