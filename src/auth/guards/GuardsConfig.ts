import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export enum GUARD_TYPE {
  TOKEN = 'TOKEN',
  COOKIES = 'COOKIES',
  PARAM = 'PARAM',
}

@Injectable()
export class GuardsConfig {
  private readonly logger = new Logger(GuardsConfig.name);
  private activeGuards: GUARD_TYPE[];

  constructor(config: ConfigService) {
    const guards: GUARD_TYPE[] =
      config.get('GUARDS')?.toUpperCase().split(',') || '';
    this.recalculateActiveGuards(guards);
  }

  public getActiveGuards() {
    return this.activeGuards;
  }

  public guardIsActive(type: GUARD_TYPE) {
    return this.activeGuards.includes(type);
  }

  public recalculateActiveGuards(newGuards: GUARD_TYPE[]) {
    this.activeGuards = [
      newGuards.includes(GUARD_TYPE.TOKEN) ? GUARD_TYPE.TOKEN : null,
      newGuards.includes(GUARD_TYPE.COOKIES) ? GUARD_TYPE.COOKIES : null,
      newGuards.includes(GUARD_TYPE.PARAM) ? GUARD_TYPE.PARAM : null,
    ].filter(Boolean);
    if (!this.activeGuards.length) {
      this.logger.log('SETTING DEFAULT GUARD TYPE');
      this.activeGuards = [GUARD_TYPE.TOKEN];
    }
    this.logger.log('ACTIVE GUARDS: ' + this.activeGuards.join(','));
  }
}
