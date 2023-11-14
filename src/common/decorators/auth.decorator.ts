import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '@guards/access-token.guard';
import { RolesGuard } from '@guards/roles.guard';
import { ROLES_KEY } from './roles.decorator';
import { Role } from '@enums/role';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(AccessTokenGuard, RolesGuard),
  );
}
