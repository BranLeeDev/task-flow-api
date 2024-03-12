import registersEnv from '@env/registers.env';
import { ENV, isProd } from '@env/variables.env';
import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [registersEnv.KEY],
      useFactory: (registerService: ConfigType<typeof registersEnv>) => {
        let DATABASE_URL: string;

        if (ENV === 'production') {
          DATABASE_URL = registerService.db.postgres.url as string;
        } else {
          const { user, password, host, port, name } =
            registerService.db.postgres;

          const USER = encodeURIComponent(user as string);
          const PASSWORD = encodeURIComponent(password as string);

          DATABASE_URL = `postgresql://${USER}:${PASSWORD}@${host}:${port}/${name}`;
        }

        return {
          type: 'postgres',
          url: DATABASE_URL,
          ssl: isProd ? true : false,
          extra: {
            ssl: isProd
              ? {
                  rejectUnauthorized: false,
                }
              : null,
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
