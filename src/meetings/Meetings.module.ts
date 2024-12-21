import { Module } from '@nestjs/common';
import { EventStoreModule } from '../event-store/event-store.module';
import { MeetingsController } from './http/Meetings.controller';
import { MeetingReadModel } from './service/Meetings.readmodel';
import { MeetingsService } from './service/Meetings.service';

@Module({
  imports: [EventStoreModule],
  controllers: [MeetingsController],
  providers: [MeetingsService, MeetingReadModel],
})
export class MeetingsModule {}
