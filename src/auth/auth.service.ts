import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(signInDto: SignInDto) {
    const user = await this.userService.getByNameOrEmail({
      ...signInDto,
      hidePassword: false,
    });

    if (!user) {
      throw new NotAcceptableException('User not found');
    }

    const passportIsValid = await bcrypt.compare(
      signInDto.password,
      user.password_hash ?? '',
    );

    if (!passportIsValid) {
      throw new NotAcceptableException('Invalid password');
    }

    return user;
  }
}
