import { DataSource } from 'typeorm';
import { EventEntity } from './Event.entity';

export const databaseProvider = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 25432,
  username: 'eventstore',
  password: 'password',
  database: 'eventstore',
  entities: [EventEntity],
  migrations: [__dirname + '/../**/migrations/*{.ts,.js}'],
});
