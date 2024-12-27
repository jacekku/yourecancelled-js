import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/Users.module';
import { SSOClient } from './SSOClient.interface';
import { FirebaseSSOClient } from './firebase/FirebaseSSO.client';
import { CookieValidationGuard } from './guards/CookieValidation.guard';
import { GuardsConfig } from './guards/GuardsConfig';
import { ParamValidationGuard } from './guards/ParamValidation.guard';
import { TokenValidationGuard } from './guards/TokenValidation.guard';

@Module({
  imports: [PassportModule, UsersModule],
  providers: [
    GuardsConfig,
    TokenValidationGuard,
    CookieValidationGuard,
    ParamValidationGuard,
    { provide: SSOClient, useClass: FirebaseSSOClient },
  ],
  exports: [
    GuardsConfig,
    SSOClient,
    TokenValidationGuard,
    CookieValidationGuard,
    ParamValidationGuard,
  ],
})
export class AuthModule {}
