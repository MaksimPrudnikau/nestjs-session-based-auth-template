import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { addSwagger } from './bootstrap/addSwagger';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV !== 'production') {
    addSwagger(app);
  }

  await app.listen(3001);

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
    addSwagger(app);
  }
}
bootstrap();
