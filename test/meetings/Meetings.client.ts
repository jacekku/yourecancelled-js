import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateEventDto } from '../../src/meetings/http/Meetings.dto';
import { ActorId, MeetingId } from '../../src/meetings/Meeting';

export class MeetingsClient {
  constructor(private readonly app: INestApplication) {}

  public createEvent(body: CreateEventDto) {
    return request(this.app.getHttpServer()).post('/events').send(body);
  }

  public getById(id: string) {
    return request(this.app.getHttpServer()).get('/events/' + id);
  }

  public getListForUser(userId: string) {
    return request(this.app.getHttpServer()).get('/events?userId=' + userId);
  }

  public addParticipant(id: MeetingId, participant: ActorId, userId: ActorId) {
    return request(this.app.getHttpServer())
      .post(`/events/${id}/participants?userId=${userId}`)
      .send({ userId: participant });
  }
}
