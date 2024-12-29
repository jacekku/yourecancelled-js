import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { ImageEntity } from './Images.repository';

export const databaseProvider = (config: ConfigService) =>
  new DataSource({
    type: 'postgres',
    host: config.get('DB_HOST') || 'localhost',
    port: config.get('DB_PORT') || 25432,
    username: config.get('DB_USER') || 'eventstore',
    password: config.get('DB_PASSWORD'),
    database: config.get('DB_DB') || 'eventstore',
    entities: [ImageEntity],
    migrations: [__dirname + '/../**/migrations/*{.ts,.js}'],
  });
