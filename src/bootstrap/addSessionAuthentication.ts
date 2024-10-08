import { INestApplication } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';

export function addSessionAuthentication(app: INestApplication) {
  app.use(
    session({
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
}
