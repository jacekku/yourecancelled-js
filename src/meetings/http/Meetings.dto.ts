import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ActorId, MeetingId } from '../Meeting';
import { MeetingEvent } from '../Meeting.events';

export enum ParticipantStatusDto {
  ATTENDING = 'ATTENDING',
  CANCELLED = 'CANCELLED',
}

export enum EventStatusDto {
  EMPTY = 'EMPTY',
  ATTENDING = 'ATTENDING',
  CANCELLED = 'CANCELLED',
}

export class CreateEventDto {
  @IsString()
  @ApiProperty({ deprecated: true })
  @IsOptional()
  public userId?: string;
  @IsNotEmpty()
  @ApiProperty()
  public name: string;
  @IsDateString()
  @ApiProperty()
  public datetime: Date;
}

export class AddParticipantDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public userId: ActorId;
}

export class ParticipantDto {
  @ApiProperty()
  userId: ActorId;

  static from(id: ActorId): ParticipantDto {
    return { userId: id };
  }
}

export class ChangeEventDataDto {
  @ApiProperty()
  @IsDateString()
  datetime?: Date;

  @ApiProperty()
  @IsString()
  name?: string;
}

export class EventDto {
  @ApiProperty()
  public id: MeetingId;
  @ApiProperty()
  public authorId: string;
  @ApiProperty({ enum: EventStatusDto })
  public status: EventStatusDto;
  @ApiProperty()
  public date: Date;
  @ApiProperty()
  public name: string;
  @ApiProperty({ isArray: true, type: ParticipantDto })
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
      case 'ParticipantRemoved':
        state.participants = state.participants.filter(
          (p) => p.userId != data.participantId,
        );
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
