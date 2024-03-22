import { UserRoles } from '@models/user.model';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { FastifyRequest } from '../models/request.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<UserRoles[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!roles) return true;
    const request: FastifyRequest = context.switchToHttp().getRequest();
    const user = request.user;
    const isAuth = roles.some((role) => role === user.role);
    if (!isAuth) {
      throw new ForbiddenException(
        'Unauthorized access: Your role is not authorized',
      );
    }
    return isAuth;
  }
}
