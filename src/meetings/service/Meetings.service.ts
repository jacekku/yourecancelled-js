import { Injectable } from "@nestjs/common";
import { CreateEventDto } from "../http/Meetings.dto";
import { event, EventStore } from "@event-driven-io/emmett";
import { Meeting } from "../Meeting";
import { PostgresEventStore } from "src/event-store/PostgresEventStore";

@Injectable()
export class MeetingsService {

    constructor(private readonly eventStore: PostgresEventStore) {

    }

    public async createEvent(body: CreateEventDto) {
        const result = Meeting.new.handle({type: 'CreateMeeting', data: {
            actorId: body.userId,
        }})
        const nextResult = result.meeting.handle({type: 'ChangeMeetingData', data: {actorId: body.userId, meetingId: result.events[0].data.meetingId, date: body.datetime, name: body.name}})
        result.events.push(...nextResult.events);
        this.eventStore.appendToStream(result.events.at(0).data.meetingId, result.events);
        return nextResult.meeting
    }
}