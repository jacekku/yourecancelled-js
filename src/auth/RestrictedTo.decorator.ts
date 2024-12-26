import { applyDecorators, Param, SetMetadata, UseGuards } from "@nestjs/common";
import { ApiUnauthorizedResponse, ApiBearerAuth } from "@nestjs/swagger";
import { TokenValidationGuard } from "./guards/TokenValidation.guard";
import { CookieValidationGuard } from "./guards/CookieValidation.guard";
import { ParamValidationGuard } from "./guards/ParamValidation.guard";

export function RestrictedTo(roles: string[]) {
    return applyDecorators(
        SetMetadata('authRoles', roles),
        UseGuards(TokenValidationGuard, CookieValidationGuard, ParamValidationGuard),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
        ApiBearerAuth(),
    )
}
