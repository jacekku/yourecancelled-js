import { Module } from '@nestjs/common';
import { EventStoreModule } from '../event-store/event-store.module';
import { AuthUserRepository, AuthUserService } from './AuthUser.service';
import { SSOClient } from './SSOClient.interface';
import { EventStoreAuthUserRepository } from './event-store-repository/EventStoreAuth.repository';
import { FirebaseSSOClient } from './firebase/FirebaseSSO.client';
import { CookieValidationGuard } from './guards/CookieValidation.guard';
import { GuardsConfig } from './guards/GuardsConfig';
import { ParamValidationGuard } from './guards/ParamValidation.guard';
import { TokenValidationGuard } from './guards/TokenValidation.guard';
import { AuthController } from './Auth.controller';

@Module({
    imports: [EventStoreModule],
    controllers: [AuthController],
    providers: [
        GuardsConfig,
        TokenValidationGuard,
        CookieValidationGuard,
        ParamValidationGuard,
        AuthUserService,
        { provide: SSOClient, useClass: FirebaseSSOClient },
        { provide: AuthUserRepository, useClass: EventStoreAuthUserRepository },
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
export class AuthModule { }
