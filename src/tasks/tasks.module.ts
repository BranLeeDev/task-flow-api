import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Tasks
import { Task } from '@entities/tasks/task.entity';
import { TasksService } from './services/tasks.service';
import { TasksController } from './controllers/tasks.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), UsersModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
