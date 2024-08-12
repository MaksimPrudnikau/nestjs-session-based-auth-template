import { Injectable } from '@nestjs/common';
import { PrismaService } from '../bootstrap/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Config } from '../../config';
import { SignUpDto } from '../auth/dto/sign-up.dto';
import { TokenService } from '../token/token.service';
import { User } from '@prisma/client';

type UserInput =
  | {
      name?: User['name'];
      email: User['email'];
    }
  | {
      name: User['name'];
      email?: User['email'];
    };

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService<Config>,
    private readonly tokenService: TokenService,
  ) {}

  get(id: User['id']) {
    return this.prisma.user.findFirst({
      where: {
        id,
        is_deleted: false,
      },
    });
  }

  getByNameOrEmail({ name, email }: UserInput) {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { name }],
        is_deleted: false,
      },
    });
  }

  async create(signUpDto: SignUpDto): Promise<User> {
    const salt = this.configService.get('HASH_SALT');
    const passwordHashPromise = bcrypt.hash(signUpDto.password, salt);

    const refreshTokenPromise = this.tokenService.generateRefreshToken();

    const [password_hash, refresh_token] = await Promise.all([
      passwordHashPromise,
      refreshTokenPromise,
    ]);

    return this.prisma.user.create({
      data: {
        name: signUpDto.name,
        email: signUpDto.email,
        password_hash,
        refresh_token,
      },
    });
  }
}
