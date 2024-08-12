import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { AuthTokens } from './types/auth-tokens';
import { randomBytes } from 'crypto';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateTokens(userId: User['id']): Promise<AuthTokens> {
    const accessTokenPromise = this.generateAccessToken(userId);
    const refreshTokenPromise = this.generateRefreshToken();

    const [access_token, refresh_token] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  generateAccessToken(userId: User['id']) {
    return this.jwtService.signAsync({ userId }, { expiresIn: '1h' });
  }

  generateRefreshToken() {
    return randomBytes(256).toString('hex');
  }
}
