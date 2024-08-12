import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Config } from '../../config';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService<Config>) => ({
        global: true,
        secret: configService.get('JWT_ACCESS_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
