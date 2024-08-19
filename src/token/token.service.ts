import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateTokens(userId: User['id']): Promise<string> {
    const accessTokenPromise = this.generateAccessToken(userId);

    const [access_token] = await Promise.all([accessTokenPromise]);

    return access_token;
  }

  generateAccessToken(userId: User['id']) {
    return this.jwtService.signAsync({ userId });
  }
}
