import { randomUUID } from 'crypto';
import { User, UserResult } from '../User';
import { CreateUser } from '../User.commands';

function expectSuccess(result: UserResult) {
  expect(result.errors).toHaveLength(0);
  expect(result.events).not.toHaveLength(0);
}

function expectError(result: UserResult) {
  expect(result.errors).not.toHaveLength(0);
  expect(result.events).toHaveLength(0);
}

describe('Users', () => {
  test('Users can be created', () => {
    const cmd: CreateUser = {
      type: 'CreateUser',
      data: { actorId: randomUUID() },
    };

    const result = User.new.handle(cmd);

    expectSuccess(result);
  });

  test('Users can add Friends', () => {
    const { events, user } = User.new.handle({
      type: 'CreateUser',
      data: { actorId: randomUUID() },
    });

    const result = user.handle({
      type: 'AddFriend',
      data: {
        actorId: randomUUID(),
        userId: events[0].data.userId,
        friendId: randomUUID(),
      },
    });

    expectSuccess(result);
  });

  test('User can change their name', () => {
    const { events, user } = User.new.handle({
      type: 'CreateUser',
      data: { actorId: randomUUID() },
    });

    const result = user.handle({
      type: 'ChangeName',
      data: {
        actorId: events.at(0).data.userId,
        userId: events.at(0).data.userId,
        name: 'New Name',
      },
    });

    expectSuccess(result);
  });
});
