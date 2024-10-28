// backend/src/decorators/roles.decorator.ts

import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles'; // Define the key for roles metadata

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);