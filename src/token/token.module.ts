import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Config } from '../../config';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService<Config>) => ({
        global: true,
        secret: configService.get('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: '1m',
        },
      }),
      global: true,
      inject: [ConfigService],
    }),
    SessionModule,
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
