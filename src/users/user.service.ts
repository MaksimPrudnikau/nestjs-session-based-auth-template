import { Injectable } from '@nestjs/common';
import { PrismaService } from '../bootstrap/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  get(id: User['id']) {
    return this.prisma.user.findFirst({
      where: {
        id,
      },
    });
  }
}
