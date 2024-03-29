import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { FastifyRequest } from 'fastify';
import { LoggerModule } from 'nestjs-pino';
import {
  CORRELATION_ID_HEADER,
  CorrelationIdMiddleware,
} from '@middlewares/correlation-id.middleware';
import { isProd } from '@env/variables.env';
import registersEnv from '@env/registers.env';
import { joiConfigSchema } from './libs/joi.lib';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: !isProd
          ? {
              target: 'pino-pretty',
              options: {
                messageKey: 'message',
              },
            }
          : undefined,
        messageKey: 'message',
        customProps: (req: FastifyRequest['raw']) => {
          return {
            correlationId: req.headers[CORRELATION_ID_HEADER],
          };
        },
        autoLogging: false,
        serializers: {
          req: () => {
            return undefined;
          },
          res: () => {
            return undefined;
          },
        },
      },
    }),
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [registersEnv],
      validationSchema: joiConfigSchema,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 900000,
        limit: 100,
      },
    ]),
  ],
})
export class ConfigModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
