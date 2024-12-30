import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/Auth.module';
import { EventStoreModule } from './event-store/event-store.module';
import { MeetingsModule } from './meetings/Meetings.module';
import { SiteModule } from './site/site.module';
import { UsersModule } from './users/Users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'static') }),
    EventStoreModule,
    MeetingsModule,
    UsersModule,
    SiteModule,
    AuthModule,
    // ImagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
