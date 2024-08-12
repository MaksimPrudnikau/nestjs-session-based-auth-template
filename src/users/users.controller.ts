import { ApiController } from '../bootstrap/api-controller.decorator';
import { UserService } from './user.service';
import { Get, Param } from '@nestjs/common';
import { User } from '@prisma/client';

@ApiController('Users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  getById(@Param('id') id: string): Promise<User | null> {
    return this.userService.get(+id);
  }
}
