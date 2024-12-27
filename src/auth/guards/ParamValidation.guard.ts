import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from '../../users/User.service';
import { GUARD_TYPE, GuardsConfig } from './GuardsConfig';

@Injectable()
export class ParamValidationGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly guardConfig: GuardsConfig,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!this.guardConfig.guardIsActive(GUARD_TYPE.PARAM)) return true;

    const request = context.switchToHttp().getRequest();
    const userId = request.query?.['userId'];

    request.user = this.userService.getUser(userId);
    return true;
  }
}
