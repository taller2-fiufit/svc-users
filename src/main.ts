import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // TODO: Sacar cuando este el gateway
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Users')
    .setDescription('Documentación de API Users')
    .setVersion('1.0')
    .addTag('Users')
    .addTag('Followers')
    .addTag('Auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const options = { jsonDocumentUrl: 'openapi.json' };
  SwaggerModule.setup('docs', app, document, options);

  await app.listen(3000);
}
bootstrap();
