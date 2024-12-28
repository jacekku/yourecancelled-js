import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthUserService } from './AuthUser.service';
import { SSOClient } from './SSOClient.interface';
import { FirebaseSSOClient } from './firebase/FirebaseSSO.client';
import { CookieValidationGuard } from './guards/CookieValidation.guard';
import { GuardsConfig } from './guards/GuardsConfig';
import { ParamValidationGuard } from './guards/ParamValidation.guard';
import { TokenValidationGuard } from './guards/TokenValidation.guard';

@Module({
  imports: [PassportModule],
  providers: [
    GuardsConfig,
    TokenValidationGuard,
    CookieValidationGuard,
    ParamValidationGuard,
    AuthUserService,
    { provide: SSOClient, useClass: FirebaseSSOClient },
  ],
  exports: [
    AuthUserService,
    GuardsConfig,
    SSOClient,
    TokenValidationGuard,
    CookieValidationGuard,
    ParamValidationGuard,
  ],
})
export class AuthModule {}
