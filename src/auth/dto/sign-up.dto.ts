import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(5).max(25),
  password: z.string().min(5).max(255),
});

export class SignUpDto extends createZodDto(schema) {}
