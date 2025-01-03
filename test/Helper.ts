import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { GUARD_TYPE } from 'src/auth/guards/GuardsConfig';
import { EventEntity } from '../src/event-store/Event.entity';
import { DataSource } from 'typeorm';
import { ImageEntity } from '../src/images/Image.entity';
import { promises } from 'dns';

export async function setupPostgresDatabaseAndSetEnv() {
  const postgresContainer = await new PostgreSqlContainer()
    .withUsername('eventstore')
    .withDatabase('eventstore')
    .start();

  process.env.DB_HOST = postgresContainer.getHost();
  process.env.DB_PORT = postgresContainer.getPort().toString();
  process.env.DB_USERNAME = postgresContainer.getUsername();
  process.env.DB_PASSWORD = postgresContainer.getPassword();
  process.env.DB_DATABASE = postgresContainer.getDatabase();
  return postgresContainer;
}

export async function truncateDB(database: DataSource) {
  await Promise.all([
    database.createQueryBuilder(EventEntity, 'events').delete().execute(),
    database.createQueryBuilder(ImageEntity, 'images').delete().execute(),
  ]);
}

export function setGuardTypes(...guards: GUARD_TYPE[]) {
  process.env.GUARDS = guards.join(',');
}
