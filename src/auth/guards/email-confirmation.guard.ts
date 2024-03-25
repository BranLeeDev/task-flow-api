import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FastifyRequest } from '../models/request.model';
import { Observable } from 'rxjs';

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: FastifyRequest = context.switchToHttp().getRequest();
    if (!request.user?.isEmailConfirmed) {
      throw new UnauthorizedException('Confirm your email first');
    }
    return true;
  }
}
