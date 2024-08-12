import { ApiController } from '../bootstrap/api-controller.decorator';
import { Body, Post } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';

@ApiController('Auth')
export class AuthController {
  @Post('sign-up')
  signUp(@Body() body: SignUpDto) {
    return body;
  }
}
