import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { appConfig } from './app.config';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Nest Fastify Vite')
    .setDescription('Awesome API 🔥')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  return app;
}

async function start(app: INestApplication) {
  await app.listen(+appConfig.APP_PORT, appConfig.APP_HOST);
  const url = await app.getUrl();
  Logger.log(`OpenAPI on: ${url}/api`, 'Bootstrap');
  Logger.log(`GraphQL playground on: ${url}/graphql`, 'Bootstrap');
}

export { bootstrap, start };
