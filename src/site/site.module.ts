import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/Auth.module';
import { MeetingsModule } from '../meetings/Meetings.module';
import { UsersModule } from '../users/Users.module';
import { SiteController } from './site.controller';

@Module({
  imports: [MeetingsModule, UsersModule, AuthModule],
  controllers: [SiteController],
})
export class SiteModule {}
