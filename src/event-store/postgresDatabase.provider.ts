import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { EventEntity } from './Event.entity';

export const databaseProvider = (config: ConfigService) =>
  new DataSource({
    type: 'postgres',
    host: config.get('DB_HOST') || 'localhost',
    port: config.get('DB_PORT') || 25432,
    username: 'eventstore',
    password: config.get('DB_PASSWORD'),
    database: 'eventstore',
    entities: [EventEntity],
    migrations: [__dirname + '/../**/migrations/*{.ts,.js}'],
  });
