import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { AppModule } from '../../src/app.module';
import { GUARD_TYPE } from '../../src/auth/guards/GuardsConfig';
import {
  setupPostgresDatabaseAndSetEnv,
  setGuardTypes,
  truncateDB,
} from '../Helper';
import { DataSource } from 'typeorm';
import { ImagesClient } from './Images.client';
import { createLocalstackWithS3 } from './Localstack.provider';
import { S3Client } from '@aws-sdk/client-s3';
import { StartedLocalStackContainer } from '@testcontainers/localstack';
import { AuthClient } from '../auth/Auth.client';

describe('Images (e2e)', () => {
  let app: INestApplication;
  let postgresContainer: StartedPostgreSqlContainer;
  let client: ImagesClient;
  let auth: AuthClient;
  let database: DataSource;
  let localstack: StartedLocalStackContainer;
  let s3: S3Client;

  beforeAll(async () => {
    setGuardTypes(GUARD_TYPE.PARAM);
    process.env.AWS_S3_BUCKET = 'bucket';
    const [psql, { localstack: ls, s3: _s3 }] = await Promise.all([
      setupPostgresDatabaseAndSetEnv(),
      createLocalstackWithS3(),
    ]);
    postgresContainer = psql;
    localstack = ls;
    s3 = _s3;
  }, 120 * 1000);

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(S3Client)
      .useValue(s3)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    client = new ImagesClient(app);
    auth = new AuthClient(app);
    database = app.get<DataSource>(DataSource);

    await truncateDB(database);
  });

  afterAll(async () => {
    await Promise.all([
      localstack.stop(),
      postgresContainer.stop(),
      app.close(),
    ]);
  });

  it('User can upload image', async () => {
    const result = await client.uploadImage('1');
    expect(result.status).toBe(201);

    expect(result.body.url).toMatch(
      /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})-([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.jpg$/i,
    );
  });

  it('User can get uploaded image', async () => {
    const {
      body: { url },
    } = await client.uploadImage('1');

    const result = await client.getImage(url, '1');
    expect(result.status).toBe(200);
    expect(result.body.url).toBeDefined();
  });

  it('User cannot get another users image', async () => {
    const {
      body: { url },
    } = await client.uploadImage('1');

    const result = await client.getImage(url, '2');
    expect(result.status).toBe(401);
  });

  it('User can grant access to image for other users', async () => {
    const {
      body: { id: grantee },
    } = await auth.whoami('2');
    const {
      body: { url },
    } = await client.uploadImage('1');

    const failing = await client.getImage(url, '2');
    expect(failing.status).toBe(401);

    await client.grantAccess(url, '1', grantee);

    const success = await client.getImage(url, '2');
    expect(success.status).toBe(200);
  });
});
