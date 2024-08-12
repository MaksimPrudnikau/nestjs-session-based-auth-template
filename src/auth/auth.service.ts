import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { TokenService } from '../token/token.service';
import { UserService } from '../users/user.service';
import { AuthTokens } from '../token/types/auth-tokens';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async register(signUpDto: SignUpDto): Promise<AuthTokens> {
    const user = await this.userService.getByNameOrEmail(signUpDto);

    if (user) {
      throw new UnauthorizedException('User already exists');
    }

    const {
      id: userId,
      refresh_token: { value: refresh_token },
    } = await this.userService.create(signUpDto);

    const access_token = await this.tokenService.generateAccessToken(userId);

    return { access_token, refresh_token };
  }

  async login(signInDto: SignInDto) {
    const user = await this.userService.getByNameOrEmail({
      email: signInDto.email,
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

    return this.tokenService.generateTokens(user.id);
  }
}
