import { Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiController } from './bootstrap/api-controller.decorator';
import * as bcrypt from 'bcrypt';

@ApiController('App')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello() {
    return bcrypt.genSalt();
  }
}
