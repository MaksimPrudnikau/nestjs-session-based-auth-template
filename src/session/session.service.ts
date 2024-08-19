import { Injectable } from '@nestjs/common';
import { user_session } from '@prisma/client';
import { PrismaService } from '../bootstrap/prisma.service';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment/moment';
import { IFingerprint } from 'nestjs-fingerprint';
import { FingerprintService } from './fingerprint.service';

@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fingerPrintService: FingerprintService,
  ) {}

  get(id: user_session['id']) {
    return this.prisma.user_session.findFirst({
      where: {
        id,
      },
    });
  }

  async createOrUpdate(user_id: string, fingerPrint: IFingerprint) {
    const { id: fingerprint_id } =
      await this.fingerPrintService.create(fingerPrint);

    return this.prisma.user_session.upsert({
      create: {
        user_id: '',
        id: uuid(),
        expired_at: moment().add('30', 'd').toDate(),
        created_at: moment().toDate(),
        fingerprint_id,
      },
      update: {
        expired_at: moment().add('30', 'd').toDate(),
      },
      where: {
        user_id_fingerprint_id_index: {
          user_id,
          fingerprint_id,
        },
      },
    });
  }
}
