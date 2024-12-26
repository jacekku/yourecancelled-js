import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { SSOClient } from "./SSOClient.interface";
import { FirebaseSSOClient } from "./firebase/FirebaseSSO.client";
import { TokenValidationGuard } from "./guards/TokenValidation.guard";
import { UsersModule } from "src/users/Users.module";
import { CookieValidationGuard } from "./guards/CookieValidation.guard";
import { ParamValidationGuard } from "./guards/ParamValidation.guard";
import { GuardsConfig } from "./guards/GuardsConfig";

@Module({
    imports: [PassportModule, UsersModule],
    providers: [
        GuardsConfig,
        TokenValidationGuard,
        CookieValidationGuard,
        ParamValidationGuard,
        { provide: SSOClient, useClass: FirebaseSSOClient }
    ],
    exports: [GuardsConfig, SSOClient, TokenValidationGuard, CookieValidationGuard, ParamValidationGuard]
})
export class AuthModule { }