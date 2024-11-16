import { Module } from '@nestjs/common';
import { EventStoreModule } from '../event-store/event-store.module';
import { MeetingsController } from './Meetings.controller';

@Module({
  imports: [EventStoreModule],
  controllers: [MeetingsController],
  providers: [],
})
export class MeetingsModule {}
