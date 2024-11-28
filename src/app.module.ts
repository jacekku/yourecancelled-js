import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventStoreModule } from './event-store/event-store.module';
import { MeetingsModule } from './meetings/Meetings.module';
import { UsersModule } from './users/Users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventStoreModule,
    MeetingsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
