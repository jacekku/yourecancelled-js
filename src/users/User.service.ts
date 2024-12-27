import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUser(id: string) {
    return { id };
  }
}
