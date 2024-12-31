import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  ChangeEventDataDto,
  CreateEventDto,
} from '../../src/meetings/http/Meetings.dto';
import { ActorId, MeetingId } from '../../src/meetings/Meeting';

export class MeetingsClient {
  constructor(private readonly app: INestApplication) { }

  public createEvent(body: CreateEventDto, userId: ActorId) {
    return request(this.app.getHttpServer()).post(`/events?userId=${userId}`).send(body);
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
  public modifyEvent(id: MeetingId, body: ChangeEventDataDto, userId: ActorId) {
    return request(this.app.getHttpServer())
      .put(`/events/${id}?userId=${userId}`)
      .send(body);
  }

}