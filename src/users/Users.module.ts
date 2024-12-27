import { Module } from '@nestjs/common';
import { EventStoreModule } from '../event-store/event-store.module';
import { UserService } from './User.service';

@Module({
  imports: [EventStoreModule],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
