import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateEventDto } from '../../src/meetings/http/Meetings.dto';

export class MeetingsClient {
  constructor(private readonly app: INestApplication) {}

  public createEvent(body: CreateEventDto) {
    return request(this.app.getHttpServer()).post('/events').send(body);
  }

  public getById(id: string) {
    return request(this.app.getHttpServer()).get('/events/' + id);
  }
}
