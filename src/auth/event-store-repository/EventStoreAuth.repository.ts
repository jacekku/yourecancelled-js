import { Event } from '@event-driven-io/emmett';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PostgresEventStore } from '../../event-store/PostgresEventStore';
import { AuthExternalId, AuthUser, AuthUserId } from '../Auth.model';
import { AuthUserRepository } from '../AuthUser.service';

type AuthUserCreatedEvent = Event<
  'AuthUserCreated',
  {
    id: AuthUserId;
    externalId: AuthExternalId;
  },
  { module: 'Auth' }
>;

type AuthUserEvents = AuthUserCreatedEvent;

@Injectable()
export class EventStoreAuthUserRepository implements AuthUserRepository {
  private readonly users: AuthUser[] = [];

  constructor(private readonly eventStore: PostgresEventStore) {
    setTimeout((() => this.reconstruct()).bind(this), 10);
  }

  async saveUser(user: AuthUser): Promise<void> {
    if (user.externalId && (await this.getUserByExternalId(user.externalId)))
      return;
    user.id = randomUUID();
    await this.eventStore.appendToStream<AuthUserEvents>(user.id, [
      {
        type: 'AuthUserCreated',
        data: {
          id: user.id,
          externalId: user.externalId,
        },
        metadata: { module: 'Auth' },
      },
    ]);
    this.users.push(user);
  }

  async getUserById(id: AuthUserId): Promise<AuthUser | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async getUserByExternalId(id: AuthExternalId): Promise<AuthUser | undefined> {
    return this.users.find((user) => user.externalId === id);
  }

  private async reconstruct() {
    const events = await this.eventStore.readAllEvents<AuthUserEvents>('Auth');
    events.events.forEach((e) => {
      switch (e.type) {
        case 'AuthUserCreated':
          this.users.push({ externalId: e.data.externalId, id: e.data.id });
      }
    });
  }
}
