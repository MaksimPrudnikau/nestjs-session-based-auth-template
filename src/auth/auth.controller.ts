import { ApiController } from '../bootstrap/api-controller.decorator';
import { Body, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from './auth.guard';
import { Fingerprint, IFingerprint } from 'nestjs-fingerprint';

@ApiController('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() body: SignUpDto, @Fingerprint() fp: IFingerprint) {
    return this.authService.register(body, fp);
  }

  @Post('sign-in')
  signIn(@Body() body: SignInDto, @Fingerprint() fp: IFingerprint) {
    return this.authService.login(body, fp);
  }

  @UseGuards(AuthGuard)
  @Get('protected')
  protectedRoute(@Req() req: Request) {
    return req['payload'];
  }

  @Get('finger-print')
  getFingerPrint(@Fingerprint() fp: IFingerprint) {
    return fp;
  }
}
