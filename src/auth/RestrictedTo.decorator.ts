import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CookieValidationGuard } from './guards/CookieValidation.guard';
import { ParamValidationGuard } from './guards/ParamValidation.guard';
import { TokenValidationGuard } from './guards/TokenValidation.guard';

export function RestrictedTo(roles: string[]) {
  return applyDecorators(
    SetMetadata('authRoles', roles),
    UseGuards(
      TokenValidationGuard,
      CookieValidationGuard,
      ParamValidationGuard,
    ),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiBearerAuth(),
  );
}
