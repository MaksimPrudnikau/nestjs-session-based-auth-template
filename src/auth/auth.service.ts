import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { PrismaService } from '../bootstrap/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(signUpDto: SignUpDto) {}

  async login(signInDto: SignInDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: signInDto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }

    const confirmPassword = bcrypt.compare(
      signInDto.password,
      user.password_hash,
    );

    if (!confirmPassword) {
      throw new UnauthorizedException('Wrong credentials');
    }

    const accessToken = await this.jwtService.signAsync(
      { userId: user.id },
      { expiresIn: '7d' },
    );

    return { accessToken, refreshToken: '' };
  }
}
