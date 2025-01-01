import { Injectable } from '@nestjs/common';
import { AuthUser } from './Auth.model';

export abstract class AuthUserRepository {
  abstract saveUser(user: AuthUser): Promise<void>;
  abstract getUserById(id: string): Promise<AuthUser | undefined>;
  abstract getUserByExternalId(id: string): Promise<AuthUser | undefined>;
}

@Injectable()
export class AuthUserService {
  constructor(private readonly userRepository: AuthUserRepository) {}

  async getUserByExternalId(authUser: AuthUser) {
    let user = await this.userRepository.getUserByExternalId(
      authUser.externalId,
    );
    if (!user) {
      user = await this.userRepository.getUserById(authUser.externalId);
    }
    if (!user) {
      await this.userRepository.saveUser(authUser);
    } else {
      return user;
    }
    return this.userRepository.getUserByExternalId(authUser.externalId);
  }
}
