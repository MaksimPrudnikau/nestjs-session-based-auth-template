import { Injectable } from '@nestjs/common';
import { PrismaService } from '../bootstrap/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Config } from '../../config';
import { SignUpDto } from '../auth/dto/sign-up.dto';
import { User } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { SessionService } from '../session/session.service';

type UserInput =
  | {
      name?: User['name'];
      email: User['email'];
      hidePassword?: boolean;
    }
  | {
      name: User['name'];
      email?: User['email'];
      hidePassword?: boolean;
    };

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService<Config>,
    private readonly sessionService: SessionService,
  ) {}

  get(id: User['id']) {
    return this.prisma.user.findFirst({
      where: {
        id,
        is_deleted: false,
      },
      omit: {
        password_hash: true,
      },
    });
  }

  getByNameOrEmail({ name, email, hidePassword }: UserInput) {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { name }],
        is_deleted: false,
      },
      omit: {
        password_hash: hidePassword === undefined ? true : hidePassword,
      },
      include: {
        user_session: {
          select: { id: true },
        },
      },
    });
  }

  async create(signUpDto: SignUpDto) {
    const salt = this.configService.get('HASH_SALT');
    const password_hash = await bcrypt.hash(signUpDto.password, salt);

    return this.prisma.user.create({
      data: {
        id: uuid(),
        name: signUpDto.name,
        email: signUpDto.email,
        password_hash,
      },
      omit: {
        password_hash: true,
      },
    });
  }

  delete(id: User['id']) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        is_deleted: true,
      },
      omit: {
        password_hash: true,
      },
    });
  }
}
