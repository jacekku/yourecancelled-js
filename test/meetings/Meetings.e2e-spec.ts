import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { AppModule } from '../../src/app.module';
import { EventStoreModule } from '../../src/event-store/event-store.module';
import { MeetingsModule } from '../../src/meetings/Meetings.module';
import { EventDto } from '../../src/meetings/http/Meetings.dto';
import { MeetingsClient } from './Meetings.client';

describe('Events (e2e)', () => {
  let app: INestApplication;
  let postgresContainer: StartedPostgreSqlContainer;
  let client: MeetingsClient;

  beforeEach(async () => {
    postgresContainer = await new PostgreSqlContainer()
      .withUsername('eventstore')
      .withDatabase('eventstore')
      .start();

    process.env.DB_HOST = postgresContainer.getHost();
    process.env.DB_PORT = postgresContainer.getPort().toString();
    process.env.DB_USERNAME = postgresContainer.getUsername();
    process.env.DB_PASSWORD = postgresContainer.getPassword();
    process.env.DB_DATABASE = postgresContainer.getDatabase();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [EventStoreModule, MeetingsModule, AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    client = new MeetingsClient(app);
  });

  afterEach(async () => {
    await postgresContainer.stop();
    await app.close();
  });

  it('Create Event', () => {
    return client
      .createEvent({
        datetime: new Date('2022-09-01T20:20:20'),
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

  it('Get by id', async () => {
    const result = await client.createEvent({
      datetime: new Date('2022-09-01T20:20:20'),
      userId: '1',
      name: '2',
    });

    const event = await client.getById(result.body.id);
    expect(event.body.id).toBe(result.body.id);
  });

  it('Get for user', async () => {
    await client.createEvent({
      datetime: new Date('2022-09-01T20:20:20'),
      userId: '1',
      name: '2',
    });

    const events = await client.getListForUser('1');
    expect(events.body).toHaveLength(1);
    expect(events.body.at(0).name).toBe('2');
  });
});
