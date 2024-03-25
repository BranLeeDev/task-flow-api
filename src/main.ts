import { NestFactory, Reflector } from '@nestjs/core';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import fastifyCookie from '@fastify/cookie';
import { AppModule } from './app.module';
import fastifyCsrfProtection from '@fastify/csrf-protection';
import fastifyHelmet from '@fastify/helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableCors();
  const configService = app.get(ConfigService);
  await app.register(fastifyCookie, {
    secret: configService.get('COOKIE_SECRET'),
  });
  await app.register(fastifyCsrfProtection, {
    cookieOpts: {
      signed: true,
    },
  });
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'img-src': ['self', 'https: data:'],
      },
    },
  });
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.setGlobalPrefix('api/v1');
  await app.listen(Number(configService.get('PORT')), '0.0.0.0');
}
bootstrap();
