import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AddressInfo } from 'net';
import httpDevServer from 'vavite/http-dev-server';
import viteDevServer from 'vavite/vite-dev-server';
import { appConfig } from './app.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      serverFactory: httpDevServer
        ? (handler) => {
            httpDevServer!.on('request', handler);
            return httpDevServer!;
          }
        : undefined,
    }),
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

  try {
    const port = httpDevServer
      ? (httpDevServer.address() as AddressInfo).port
      : appConfig.APP_PORT;
    await app.listen(port, appConfig.APP_HOST);
    const url = await app.getUrl();

    Logger.log(`OpenAPI on: ${url}/api`, 'Bootstrap');
    Logger.log(`GraphQL playground on: ${url}/graphql`, 'Bootstrap');
  } catch (err) {
    if (err instanceof Error) viteDevServer?.ssrFixStacktrace(err);
    viteDevServer?.config.logger.error(err);
  }
}

bootstrap();
