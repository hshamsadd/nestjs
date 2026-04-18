import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  // Reflector is a utility that will help you access metadata
  constructor(private reflector: Reflector) {}

  // next method in Expressjs -> router.post("/" , A, B, C, handler)
  canActivate(context: ExecutionContext): boolean {
    // CanActivate retrives the roles metadata set by roles decorator
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [
        context.getHandler(), // method level metadata
        context.getClass(), // class level metadata
      ],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }
    const hasRequiredRole = requiredRoles.some((role) => user.role === role);
    if (!hasRequiredRole) {
      throw new ForbiddenException('Insuffiecient permission');
    }
    return true;
  }
}

/*
workflow
Route A

client request -> jwtauthguard -> validate the token and attach current user in the request
-> rolesguard check if current user role matches the required role
-> if match found then proceed to controller else  forbidden exception
*/
