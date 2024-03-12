import registersEnv from '@env/registers.env';
import { ENV, isProd } from '@env/variables.env';
import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users/user.entity';
import { Team } from './entities/users/team.entity';
import { Task } from './entities/tasks/task.entity';
import { Project } from './entities/tasks/project.entity';

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
          entities: [User, Team, Task, Project],
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
