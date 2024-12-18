import { Injectable } from '@nestjs/common';
import { PostgresEventStore } from '../../event-store/PostgresEventStore';
import { CreateEventDto, EventDto } from '../http/Meetings.dto';
import { ActorId, Meeting, MeetingId, MeetingResult } from '../Meeting';

@Injectable()
export class MeetingsService {
  private readonly events: Map<MeetingId, EventDto>;
  private readonly userEvents: Map<ActorId, EventDto[]>;

  constructor(private readonly eventStore: PostgresEventStore) {
    this.events = new Map();
    this.userEvents = new Map();
  }

  public async createEvent(body: CreateEventDto): Promise<MeetingResult> {
    const result = Meeting.new.handle({
      type: 'CreateMeeting',
      data: {
        actorId: body.userId,
      },
    });
    const nextResult = result.meeting.handle({
      type: 'ChangeMeetingData',
      data: {
        actorId: body.userId,
        meetingId: result.events[0].data.meetingId,
        date: body.datetime,
        name: body.name,
      },
    });

    const allEvents = [...result.events, ...nextResult.events];

    await this.eventStore.appendToStream(
      result.events.at(0).data.meetingId,
      allEvents,
    );

    const event = EventDto.from(allEvents);
    this.events.set(event.id, event);
    const existing = this.userEvents.get(event.authorId) || [];
    existing.push(event);
    this.userEvents.set(event.authorId, existing);

    return {
      errors: [],
      events: allEvents,
      meeting: nextResult.meeting,
    };
  }

  public async getById(id: MeetingId): Promise<EventDto> {
    return this.events.get(id);
  }

  public async getListFor(userId: ActorId): Promise<EventDto[]> {
    return this.userEvents.get(userId) || [];
  }
}
