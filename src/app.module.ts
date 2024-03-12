import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [CommonModule, UsersModule, TasksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
