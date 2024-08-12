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

    if (!token) {
      throw new UnauthorizedException('Token is not provided');
    }

    request['payload'] = this.verifyToken(token);
    Logger.log(request['payload']);
    return true;
  }

  private extractTokenFromHeader(request: Request) {
    return request.headers.authorization?.split(' ')[1];
  }

  private verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify<Payload>(token);
      return PayloadSchema.parse(payload);
    } catch (e: any) {
      throw new UnauthorizedException('Invalid token', e.message);
    }
  }
}
