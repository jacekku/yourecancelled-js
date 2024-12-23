import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventStoreModule } from './event-store/event-store.module';
import { MeetingsModule } from './meetings/Meetings.module';
import { UsersModule } from './users/Users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SiteModule } from './site/site.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'static'), }),
    EventStoreModule,
    MeetingsModule,
    UsersModule,
    SiteModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
