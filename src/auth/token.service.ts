import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Config } from '../../config';
import * as bcrypt from 'bcrypt';
import { AuthTokens } from './types/auth-tokens';

type UserInput = {
  id: User['id'];
  name: User['name'];
};

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Config>,
  ) {}

  async generateTokens(user: UserInput): Promise<AuthTokens> {
    const accessTokenPromise = this.generateAccessToken(user.id);
    const refreshTokenPromise = this.generateRefreshToken(user.name);

    const [access_token, refresh_token] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  private generateAccessToken(userId: User['id']) {
    return this.jwtService.signAsync({ userId }, { expiresIn: '1h' });
  }

  private generateRefreshToken(name: User['name']) {
    const salt = this.configService.get('HASH_SALT');
    return bcrypt.hash(name, salt);
  }
}
