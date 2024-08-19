import { Injectable } from '@nestjs/common';
import { PrismaService } from '../bootstrap/prisma.service';
import { IFingerprint } from 'nestjs-fingerprint';
import { FingerprintEntity } from './fingerprint.entity';

@Injectable()
export class FingerprintService {
  constructor(private readonly prisma: PrismaService) {}

  create(fingerPrint: IFingerprint) {
    const { id, ...rest } = new FingerprintEntity(fingerPrint);

    return this.prisma.fingerprint.upsert({
      create: { id, ...rest },
      update: {},
      where: {
        fingerprint_unique_index: rest,
      },
    });
  }
}
