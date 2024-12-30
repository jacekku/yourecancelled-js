import { Module } from '@nestjs/common';
import { DatabaseModule } from '../common/database/Database.module';
import { EventStore } from './EventStore';
import { PostgresEventStore } from './PostgresEventStore';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: EventStore,
      useClass: PostgresEventStore,
    },
    PostgresEventStore,
  ],
  exports: [PostgresEventStore],
})
export class EventStoreModule {}
