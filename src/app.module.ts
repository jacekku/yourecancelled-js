import { Module } from '@nestjs/common';
import { MeetingsModule } from './meetings/Meetings.module';
import { UsersModule } from './users/Users.module';
import { EventStoreModule } from './event-store/event-store.module';

@Module({
  imports: [EventStoreModule,  MeetingsModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
