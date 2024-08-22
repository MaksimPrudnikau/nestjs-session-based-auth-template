import { z } from 'nestjs-zod/z';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  DATABASE_URL: z.string(),
  SESSION_SECRET: z.string(),
  HASH_SALT: z.string(),
});

export type Config = z.infer<typeof schema>;
