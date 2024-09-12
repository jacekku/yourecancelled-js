import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { EventStore } from './EventStore';
import { PostgresEventStore } from './PostgresEventStore';
import { databaseProvider } from './postgresDatabase.provider';

@Module({
  providers: [
    {
      provide: DataSource,
      useFactory: () => {
        return databaseProvider.initialize();
      },
    },
    {
      provide: EventStore,
      useClass: PostgresEventStore,
    },
  ],
  exports: [EventStore],
})
export class EventStoreModule {}
