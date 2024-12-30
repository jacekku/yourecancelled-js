import { Injectable } from '@nestjs/common';
import { PostgresEventStore } from '../../event-store/PostgresEventStore';
import { EventDto } from '../http/Meetings.dto';
import { ActorId, MeetingId } from '../Meeting';
import { MeetingEvent } from '../Meeting.events';

@Injectable()
export class MeetingReadModel {
  private readonly events: Map<MeetingId, EventDto>;
  private readonly userEvents: Map<ActorId, Set<EventDto>>;

  constructor(private readonly eventStore: PostgresEventStore) {
    this.events = new Map();
    this.userEvents = new Map();

    setTimeout(
      (() => {
        this.reconstruct();
      }).bind(this),
      10,
    );
  }

  private async reconstruct() {
    // change this for ReadModel in DB
    const allEvents =
      await this.eventStore.readAllEvents<MeetingEvent>('Meetings');
    this.processEvents(allEvents.events);
  }

  public async getById(id: MeetingId): Promise<EventDto> {
    return this.events.get(id);
  }

  public async getListFor(userId: ActorId): Promise<EventDto[]> {
    console.log(this.userEvents);
    console.log(userId);
    console.log(this.userEvents.get(userId));
    return Array.from(this.userEvents.get(userId) || new Set());
  }

  private addToReadModel(event: EventDto) {
    this.events.set(event.id, event);
    const existing = this.userEvents.get(event.authorId) || new Set();
    existing.add(event);
    this.userEvents.set(event.authorId, existing);
  }

  public processEvents(events: MeetingEvent[]) {
    events.forEach((event) => {
      if (event.metadata.module != 'Meetings') return;
      let eventDto = this.events.get(event.data.meetingId);
      if (!eventDto) {
        eventDto = EventDto.from([event]);
      } else {
        eventDto = EventDto.evolve(eventDto, event);
      }
      this.addToReadModel(eventDto);
    });
  }
}
