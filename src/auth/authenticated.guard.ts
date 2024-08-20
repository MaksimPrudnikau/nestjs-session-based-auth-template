import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_AUTHORIZED_KEY } from './authorized.decorator';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext) {
    const isPublic = this.isPublicMethod(context);

    Logger.debug(isPublic);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    return request.isAuthenticated();
  }

  private isPublicMethod(context: ExecutionContext) {
    const isAuthorized = this.reflector.getAllAndOverride<boolean | undefined>(
      IS_AUTHORIZED_KEY,
      [context.getHandler(), context.getClass()],
    );

    return !isAuthorized;
  }
}
