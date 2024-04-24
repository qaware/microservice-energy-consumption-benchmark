/*
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// TODO: might get faster by using Fastify
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(8080);
}
bootstrap();
*/
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableShutdownHooks();
  await app.listen(8080, '0.0.0.0');
}
bootstrap();
