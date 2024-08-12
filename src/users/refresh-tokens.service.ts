import { Injectable } from '@nestjs/common';
import { PrismaService } from '../bootstrap/prisma.service';

@Injectable()
export class RefreshTokensService {
  constructor(private readonly prisma: PrismaService) {}
}
