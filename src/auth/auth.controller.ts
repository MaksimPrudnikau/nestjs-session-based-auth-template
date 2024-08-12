import { ApiController } from '../bootstrap/api-controller.decorator';
import { Body, NotImplementedException, Post } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

@ApiController('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() body: SignUpDto) {
    throw new NotImplementedException();
  }

  @Post('sign-in')
  signIn(@Body() body: SignInDto) {
    return this.authService.login(body);
  }
}
