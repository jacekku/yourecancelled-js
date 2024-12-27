import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/Auth.module';
import { EventStoreModule } from '../event-store/event-store.module';
import { UsersModule } from '../users/Users.module';
import { MeetingsController } from './http/Meetings.controller';
import { MeetingReadModel } from './service/Meetings.readmodel';
import { MeetingsService } from './service/Meetings.service';

@Module({
  imports: [EventStoreModule, UsersModule, AuthModule],
  controllers: [MeetingsController],
  providers: [MeetingsService, MeetingReadModel],
  exports: [MeetingsService, MeetingReadModel],
})
export class MeetingsModule {}
