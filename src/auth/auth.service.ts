import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { TokenService } from '../token/token.service';
import { UserService } from '../users/user.service';
import { IFingerprint } from 'nestjs-fingerprint';
import { SessionService } from '../session/session.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly sessionService: SessionService,
  ) {}

  async register(signUpDto: SignUpDto, fingerPrint: IFingerprint) {
    const user = await this.userService.getByNameOrEmail(signUpDto);

    if (user) {
      throw new UnauthorizedException('User already exists');
    }

    const newUser = await this.userService.create(signUpDto);
    const session = await this.sessionService.createOrUpdate(
      newUser.id,
      fingerPrint,
    );

    const access_token = await this.tokenService.generateAccessToken(
      newUser.id,
    );

    return { access_token, refresh_token: session.id };
  }

  async login(signInDto: SignInDto, fingerPrint: IFingerprint) {
    const user = await this.userService.getByNameOrEmail({
      email: signInDto.email,
      hidePassword: false,
    });

    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }

    const confirmPassword = bcrypt.compare(
      signInDto.password,
      user.password_hash,
    );

    if (!confirmPassword) {
      throw new UnauthorizedException('Wrong credentials');
    }

    const session = await this.sessionService.createOrUpdate(
      user.id,
      fingerPrint,
    );

    const access_token = await this.tokenService.generateAccessToken(user.id);

    return {
      access_token,
      refresh_token: session.id,
    };
  }
}
