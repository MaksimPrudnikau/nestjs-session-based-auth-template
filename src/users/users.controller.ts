import { ApiController } from '../bootstrap/api-controller.decorator';
import { UserService } from './user.service';
import { Delete, Get, Param } from '@nestjs/common';

@ApiController('Users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.userService.get(id);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
