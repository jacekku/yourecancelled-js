import { Injectable } from '@nestjs/common';
import { PostgresEventStore } from '../../event-store/PostgresEventStore';
import { CreateEventDto } from '../http/Meetings.dto';
import { Meeting, MeetingResult } from '../Meeting';

@Injectable()
export class MeetingsService {
  constructor(private readonly eventStore: PostgresEventStore) {}

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

    await this.eventStore.appendToStream(result.events.at(0).data.meetingId, [
      ...result.events,
      ...nextResult.events,
    ]);
    return {
      errors: [],
      events: [...result.events, ...nextResult.events],
      meeting: nextResult.meeting,
    };
  }
}
