import { Module } from '@nestjs/common';
import { MeetingsModule } from './meetings/Meetings.module';
import { UsersModule } from './users/Users.module';
import { EventStoreModule } from './event-store/event-store.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
      ConfigModule.forRoot({ isGlobal: true }),
  EventStoreModule, MeetingsModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
