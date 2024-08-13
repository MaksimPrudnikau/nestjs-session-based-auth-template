import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Payload, PayloadSchema } from './types/payload';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    request['payload'] = this.verifyToken(token);
    Logger.log(request['payload']);

    return true;
  }

  private extractTokenFromHeader(request: Request): string {
    let token: string | undefined;
    try {
      token = request.headers.authorization?.split(' ')[1];

      if (!token) {
        throw new Error();
      }
    } catch (e) {
      throw new UnauthorizedException('Token is not provided');
    }

    return token;
  }

  private verifyToken(token: string) {
    let payload: Payload | undefined;
    try {
      payload = this.jwtService.verify<Payload>(token);
    } catch (e) {
      Logger.log(e);
      throw new UnauthorizedException('Token is expired');
    }

    return PayloadSchema.parse(payload);
  }
}
