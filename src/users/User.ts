import { randomUUID } from 'crypto';
import { UserCommand } from './User.commands';
import { UserEvents } from './User.event';

export type UserError = unknown;

export type UserResult = {
  events: UserEvents[];
  errors: UserError[];
  user?: User;
};

export class User {
  public static get new() {
    return new User();
  }

  public handle(command: UserCommand): UserResult {
    switch (command.type) {
      case 'CreateUser': {
        const events: UserEvents[] = [
          {
            type: 'UserCreated',
            data: {
              userId: randomUUID(),
              actorId: command.data.actorId,
              timestamp: Date.now(),
            },
          },
        ];
        this.apply(events);
        return this.result({ events });
      }
      case 'AddFriend': {
        const events: UserEvents[] = [
          {
            type: 'FriendAdded',
            data: {
              actorId: command.data.actorId,
              friendId: command.data.friendId,
              userId: command.data.userId,
              timestamp: Date.now(),
            },
          },
        ];

        this.apply(events);
        return this.result({ events });
      }
      case 'ChangeName': {
        const events: UserEvents[] = [
          {
            type: 'NameChanged',
            data: {
              actorId: command.data.actorId,
              userId: command.data.userId,
              name: command.data.name,
              timestamp: Date.now(),
            },
          },
        ];

        this.apply(events);
        return this.result({ events });
      }
      default:
        return this.result({});
    }
  }

  private applyEvent(event: UserEvents) {
    switch (event.type) {
      default:
        return this;
    }
  }

  private result(data: {
    events?: UserEvents[];
    errors?: Error[];
    user?: User;
  }): UserResult {
    return {
      errors: data.errors || [],
      events: data.events || [],
      user: data.user || this,
    };
  }

  public apply(events: UserEvents[]): User {
    events.forEach((event) => this.applyEvent(event));
    return this;
  }
}
