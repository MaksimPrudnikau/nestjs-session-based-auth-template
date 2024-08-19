import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { FingerprintService } from './fingerprint.service';

@Module({
  providers: [SessionService, FingerprintService],
  exports: [SessionService],
})
export class SessionModule {}
