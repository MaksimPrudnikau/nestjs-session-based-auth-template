import { applyDecorators, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export function ApiController(name: string) {
  return applyDecorators(ApiTags(name), Controller(name));
}
