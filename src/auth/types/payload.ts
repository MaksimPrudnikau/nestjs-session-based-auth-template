import { z } from 'nestjs-zod/z';
import * as moment from 'moment';

export const PayloadSchema = z.object({
  userId: z.string().uuid(),
  iat: z.number().transform((x) => moment(x).toDate()),
  exp: z.number().transform((x) => moment(x).toDate()),
});

export type Payload = z.infer<typeof PayloadSchema>;
