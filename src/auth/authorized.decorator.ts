import { SetMetadata } from '@nestjs/common';

export const IS_AUTHORIZED_KEY = 'isAuthorized';
export const Authorized = () => SetMetadata(IS_AUTHORIZED_KEY, true);
