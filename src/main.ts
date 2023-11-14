import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { APP_PORT } from '@environments';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '@exceptions/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    rawBody: true,
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Wallet API docs')
    .setDescription('The Wallet is refer matching friends')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(APP_PORT);

  console.log(
    '\x1b[36m',
    `\nServer listening on: http://localhost:${APP_PORT}\nAPI docs: http://localhost:${APP_PORT}/docs`,
  );
}
bootstrap();
