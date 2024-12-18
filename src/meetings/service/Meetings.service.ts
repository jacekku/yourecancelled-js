import { Injectable } from '@nestjs/common';
import { PostgresEventStore } from '../../event-store/PostgresEventStore';
import { CreateEventDto, EventDto } from '../http/Meetings.dto';
import { ActorId, Meeting, MeetingId, MeetingResult } from '../Meeting';
import { MeetingEvent } from '../Meeting.events';

@Injectable()
export class MeetingsService {
  private readonly events: Map<MeetingId, EventDto>;
  private readonly userEvents: Map<ActorId, EventDto[]>;

  constructor(private readonly eventStore: PostgresEventStore) {
    this.events = new Map();
    this.userEvents = new Map();

    this.reconstruct();
  }

  private async reconstruct() {
    // change this for ReadModel in DB
    const allEvents = await this.eventStore.readAllEvents<MeetingEvent>();
    allEvents.events.forEach((event) => {
      let eventDto = this.events.get(event.data.meetingId);
      if (!eventDto) {
        eventDto = EventDto.from([event]);
      } else {
        eventDto = EventDto.evolve(eventDto, event);
      }
      this.addToReadModel(eventDto);
    });
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
    this.addToReadModel(event);

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

  private addToReadModel(event: EventDto) {
    this.events.set(event.id, event);
    const existing = this.userEvents.get(event.authorId) || [];
    existing.push(event);
    this.userEvents.set(event.authorId, existing);
  }
}
