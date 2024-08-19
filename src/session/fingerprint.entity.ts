import { IFingerprint } from 'nestjs-fingerprint';
import { v4 as uuid } from 'uuid';
import { fingerprint } from '@prisma/client';

export class FingerprintEntity implements fingerprint {
  id: string;
  browser: string;
  device: string;
  os: string;
  ip: string;

  constructor(fingerPrint: IFingerprint) {
    this.id = uuid();
    this.browser = `${fingerPrint.browser.family} ${fingerPrint.browser.version}`;
    this.device = `${fingerPrint.device.family} ${fingerPrint.device.version}`;
    this.os = `${fingerPrint.os.family} ${fingerPrint.os.major} ${fingerPrint.os.minor}`;
    this.ip = fingerPrint.ipAddress.value;
  }
}
