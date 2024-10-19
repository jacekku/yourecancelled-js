import { Event, Flavour } from '@event-driven-io/emmett';

export type UserId = Flavour<string, 'UserId'>;

export type UserCreated = Event<
  'UserCreated',
  {
    userId: UserId;
    actorId: UserId;
    timestamp: number;
  }
>;

export type FriendAdded = Event<
  'FriendAdded',
  {
    userId: UserId;
    friendId: UserId;
    actorId: UserId;
    timestamp: number;
  }
>;

export type NameChanged = Event<
  'NameChanged',
  {
    actorId: UserId;
    userId: UserId;
    name: string;
    timestamp: number;
  }
>;

export type UserEvents = UserCreated | FriendAdded | NameChanged;
