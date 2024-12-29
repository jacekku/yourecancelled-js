import { Injectable } from '@nestjs/common';
import { AuthExternalId, AuthUser, AuthUserId } from './Auth.model';

export abstract class AuthUserRepository {
  abstract saveUser(user: AuthUser): Promise<void>;
  abstract getUserById(id: AuthUserId): Promise<AuthUser | undefined>;
  abstract getUserByExternalId(
    id: AuthExternalId,
  ): Promise<AuthUser | undefined>;
}

@Injectable()
export class AuthUserService {
  constructor(private readonly userRepository: AuthUserRepository) {}

  async getUserByExternalId(authUser: AuthUser) {
    const user = await this.userRepository.getUserByExternalId(
      authUser.externalId,
    );
    if (!user) {
      await this.userRepository.saveUser(authUser);
    }
    return this.userRepository.getUserByExternalId(authUser.externalId);
  }
}
