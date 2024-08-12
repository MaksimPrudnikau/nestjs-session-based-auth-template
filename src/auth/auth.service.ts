import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  async register(signUpDto: SignUpDto) {}

  async login(signInDto: SignInDto) {}
}
