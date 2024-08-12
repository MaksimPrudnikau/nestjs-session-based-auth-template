import { z } from 'nestjs-zod/z';
import { ConfigService } from '@nestjs/config';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  DATABASE_URL: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  HASH_SALT: z.string(),
});

export type Config = ConfigService<z.infer<typeof schema>>;
