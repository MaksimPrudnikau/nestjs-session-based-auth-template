import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { PrismaService } from '../bootstrap/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Config } from '../../config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Config>,
  ) {}

  async register(signUpDto: SignUpDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: signUpDto.email }, { name: signUpDto.name }],
        NOT: {
          is_deleted: true,
        },
      },
    });

    if (user) {
      throw new UnauthorizedException('User already exists');
    }

    const salt = this.configService.get('HASH_SALT');
    const password_hash = await bcrypt.hash(signUpDto.password, salt);

    return this.prisma.user.create({
      data: {
        name: signUpDto.name,
        email: signUpDto.email,
        password_hash,
      },
    });
  }

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
