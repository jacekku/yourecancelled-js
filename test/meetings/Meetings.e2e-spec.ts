import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { MeetingsModule } from '../../src/meetings/Meetings.module';
import { EventDto } from '../../src/meetings/http/Meetings.dto';

describe('Events (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MeetingsModule, AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Create Event', () => {
    return request(app.getHttpServer())
      .post('/events')
      .send({
        datetime: '2022-09-01T20:20:20',
        userId: '1',
        name: '2',
      })
      .expect(201)
      .expect((req) => {
        const meeting = req.body as EventDto;
        expect(meeting.id).not.toBeNull();
        expect(meeting.authorId).toBe('1');
        expect(meeting.name).toBe('2');
      });
  });
});
