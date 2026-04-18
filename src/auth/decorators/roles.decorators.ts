import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../entities/user.entity';

// -> serves as a uniqure identifier for storing and retriving role requirements as metadata on route handlers
export const ROLES_KEY = 'roles';

// -> roles decorator marks the routes with the roles that are allowed to access them
// -> roles guard will later read this metadata to check if the user has permissions
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
