import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UsersController } from './users.controller';

@Module({
  imports: [],
  providers: [UserService],
  controllers: [UsersController],
  exports: [UserService],
})
export class UsersModule {}
