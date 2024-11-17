import { DataSource } from 'typeorm';
import { EventEntity } from './Event.entity';
import { ConfigService } from '@nestjs/config';

export const databaseProvider = (config: ConfigService) => new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 25432,
  username: 'eventstore',
  password: config.get('DB_PASSWORD'), 
  database: 'eventstore',
  entities: [EventEntity],
  migrations: [__dirname + '/../**/migrations/*{.ts,.js}'],
});
