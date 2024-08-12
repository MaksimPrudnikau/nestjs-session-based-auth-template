import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { patchNestJsSwagger } from 'nestjs-zod';

export function addSwagger(app: INestApplication) {
  patchNestJsSwagger();

  const config = new DocumentBuilder()
    .setTitle('Remusic API')
    .setDescription('Remusic API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });
}
