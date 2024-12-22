import { Injectable } from '@nestjs/common';
import { PostgresEventStore } from '../../event-store/PostgresEventStore';
import { AddParticipantDto, CreateEventDto } from '../http/Meetings.dto';
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

    result.events = [...events, ...result.events];
    return result;
  }
}
