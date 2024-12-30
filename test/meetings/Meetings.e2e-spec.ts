import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { AppModule } from '../../src/app.module';
import { AuthModule } from '../../src/auth/Auth.module';
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
    process.env.GUARDS = 'PARAM';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [EventStoreModule, MeetingsModule, AuthModule, AppModule],
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

  it('Add Participant', async () => {
    const event = (
      await client.createEvent({
        datetime: new Date('2022-09-01T20:20:20'),
        userId: '1',
        name: '2',
      })
    ).body;

    const result = (await client.addParticipant(event.id, '2', '1')).body;

    expect(result.participants).toContainEqual({ userId: '2' });
  });

  it('Change meeting data', async () => {
    const startingDate = new Date();
    const startingName = 'starting';
    const event = (
      await client.createEvent({
        datetime: startingDate,
        userId: '1',
        name: startingName,
      })
    ).body;

    const name = 'new';
    const datetime = new Date('2020-01-01');

    let result = (await client.modifyEvent(event.id, {}, '1')).body;
    expect(result.name).toBe(startingName);
    expect(result.date).toBe(startingDate.toISOString());

    result = (await client.modifyEvent(event.id, { name }, '1')).body;
    expect(result.name).toBe(name);
    expect(result.date).toBe(startingDate.toISOString());

    result = (await client.modifyEvent(event.id, { datetime }, '1')).body;
    expect(result.name).toBe(name);
    expect(result.date).toBe(datetime.toISOString());

    const newDateTime = new Date('2023-01-01');
    const newName = 'newName';
    result = (
      await client.modifyEvent(
        event.id,
        { datetime: newDateTime, name: newName },
        '1',
      )
    ).body;
    expect(result.name).toBe(newName);
    expect(result.date).toBe(newDateTime.toISOString());
  });
});
