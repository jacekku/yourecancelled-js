import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { EventStore } from './EventStore';
import { PostgresEventStore } from './PostgresEventStore';
import { databaseProvider } from './postgresDatabase.provider';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: DataSource,
      useFactory: (config: ConfigService) => {
        return databaseProvider(config).initialize();
      },
      inject: [ConfigService]
    },
    {
      provide: EventStore,
      useClass: PostgresEventStore,
    },
    PostgresEventStore
  ],
  exports: [PostgresEventStore],
})
export class EventStoreModule {}
