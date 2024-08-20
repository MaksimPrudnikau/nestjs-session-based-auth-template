import { ApiController } from '../bootstrap/api-controller.decorator';
import { Body, Get, Post, Request, UseGuards } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from '../users/user.service';
import { LocalAuthGuard } from './local.auth.guard';
import { SignInDto } from './dto/sign-in.dto';
import { Authorized } from './authorized.decorator';

@ApiController('Auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('sign-up')
  async signUp(@Body() body: SignUpDto) {
    return this.userService.create(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto, @Request() req: any) {
    return req.user;
  }

  @Authorized()
  @Get('protected')
  getProtected(@Request() req: any) {
    return req.user;
  }

  @Post('sign-out')
  signOut(@Request() req: any) {
    req.session.destroy();
    return 'success logout';
  }
}
