import { ActorId, Meeting, MeetingId, MeetingStatus } from '../Meeting';

export class CreateEventDto {
  public userId: string;
  public name: string;
  public datetime: Date;
}

export class EventDto extends Meeting {
  public id: MeetingId;
  public authorId: string;
  public eventStatus: EventStatusDto;
  public date: Date;
  public name: string;
  public participants: ParticipantDto[];

  static from(meeting: Meeting): EventDto | PromiseLike<EventDto> {
    const am = meeting as any;
    return {
      id: am.id,
      authorId: am.creator,
      eventStatus: EventDto.statusFrom(am.status),
      date: am.date,
      name: am.name,
      participants: am.participants.map(ParticipantDto.from),
    } as EventDto;
  }

  static statusFrom(status: MeetingStatus) {
    switch (status) {
      case MeetingStatus.Active:
        return EventStatusDto.ATTENDING;
      case MeetingStatus.Cancelled:
        return EventStatusDto.CANCELLED;
    }
  }
}

export class ParticipantDto {
  userId: ActorId;

  static from(id: ActorId) {
    return id;
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
