import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../users/User.service';
import { SSOClient } from '../SSOClient.interface';
import { GUARD_TYPE, GuardsConfig } from './GuardsConfig';

@Injectable()
export class TokenValidationGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly ssoClient: SSOClient,
    private readonly guardConfig: GuardsConfig,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!this.guardConfig.guardIsActive(GUARD_TYPE.TOKEN)) return true;

    const request = context.switchToHttp().getRequest();

    const token = this.pickTokenFrom(request);
    const user = await this.authorize(token);
    const profile = this.userService.getUser(user.id);

    request.user = profile;

    return true;
  }

  private pickTokenFrom(request: Request) {
    const header =
      request.headers['Authorization'] || request.headers['authorization'];
    if (!header) {
      throw new UnauthorizedException('Unauthorized');
    }
    1;
    const token = Array.isArray(header) ? header[0] : header;
    return token.replace(/^(Bearer |Bearer)/, '');
  }

  private async authorize(token: string) {
    const user = await this.ssoClient.authenticate(token);
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }
    return user;
  }
}
