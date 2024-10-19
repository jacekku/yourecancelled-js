import { Command } from '@event-driven-io/emmett';
import { UserId } from './User.event';

export type CreateUser = Command<
  'CreateUser',
  {
    actorId: UserId;
  }
>;

export type AddFriend = Command<
  'AddFriend',
  {
    actorId: UserId;
    userId: UserId;
    friendId: UserId;
  }
>;

export type ChangeName = Command<
  'ChangeName',
  {
    actorId: UserId;
    userId: UserId;
    name: string;
  }
>;

export type UserCommand = CreateUser | AddFriend | ChangeName;
