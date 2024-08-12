import { User } from '@prisma/client';

export type Payload = {
  userId: User['id'];
};
