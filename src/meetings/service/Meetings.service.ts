import { Injectable } from '@nestjs/common';
import { PostgresEventStore } from '../../event-store/PostgresEventStore';
import {
  AddParticipantDto,
  ChangeEventDataDto,
  CreateEventDto,
} from '../http/Meetings.dto';
import { ActorId, Meeting, MeetingId, MeetingResult } from '../Meeting';
import { MeetingEvent } from '../Meeting.events';
import { MeetingReadModel } from './Meetings.readmodel';

@Injectable()
export class MeetingsService {
  constructor(
    private readonly eventStore: PostgresEventStore,
    private readonly readModel: MeetingReadModel,
  ) {}

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

    this.readModel.processEvents(allEvents);

    return {
      errors: [],
      events: allEvents,
      meeting: nextResult.meeting,
    };
  }

  public async addParticipant(
    meetingId: MeetingId,
    body: AddParticipantDto,
    actorId: ActorId,
  ): Promise<MeetingResult> {
    const events = (await this.eventStore.readStream<MeetingEvent>(meetingId))
      .events;
    const meeting = Meeting.new.apply(events);

    const result = meeting.handle({
      type: 'AddParticipant',
      data: {
        actorId,
        meetingId,
        participantId: body.userId,
      },
    });

    return this.processResult(result, events);
  }

  async removeParticipant(
    id: MeetingId,
    participantId: ActorId,
    actorId: ActorId,
  ) {
    const events = (await this.eventStore.readStream<MeetingEvent>(id)).events;
    const meeting = Meeting.new.apply(events);

    const result = meeting.handle({
      type: 'RemoveParticipant',
      data: { actorId, participantId },
    });

    return this.processResult(result, events);
  }

  public async modifyEvent(
    meetingId: MeetingId,
    body: ChangeEventDataDto,
    actorId: ActorId,
  ) {
    const events = (await this.eventStore.readStream<MeetingEvent>(meetingId))
      .events;
    const meeting = Meeting.new.apply(events);

    const result = meeting.handle({
      type: 'ChangeMeetingData',
      data: {
        actorId,
        meetingId,
        date: body.datetime,
        name: body.name,
      },
    });

    return this.processResult(result, events);
  }

  private async processResult(
    result: MeetingResult,
    events: MeetingEvent[],
  ): Promise<MeetingResult> {
    if (!result.errors.length) {
      await this.eventStore.appendToStream(
        result.events.at(0).data.meetingId,
        result.events,
      );

      this.readModel.processEvents(result.events);
    }

    result.events = [...events, ...result.events];
    return result;
  }
}
