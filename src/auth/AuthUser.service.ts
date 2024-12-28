import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthUserService {
  getUser(id: string) {
    return { id };
  }
}
