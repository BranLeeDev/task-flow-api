import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { EmailsModule } from './emails/emails.module';
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [
    CommonModule,
    UsersModule,
    TasksModule,
    AuthModule,
    EmailsModule,
    CaslModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
