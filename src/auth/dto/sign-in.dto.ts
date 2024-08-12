import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(5).max(255),
});

export class SignInDto extends createZodDto(schema) {}
