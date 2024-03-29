import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Tasks
import { Task } from '@entities/tasks/task.entity';
import { TasksService } from './services/tasks.service';
import { TasksController } from './controllers/tasks.controller';
import { UsersModule } from 'src/users/users.module';

// Projects
import { Project } from '@entities/index';
import { ProjectsService } from './services/projects.service';
import { ProjectsController } from './controllers/projects.controller';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Project]), UsersModule, CaslModule],
  controllers: [TasksController, ProjectsController],
  providers: [TasksService, ProjectsService],
  exports: [TasksService],
})
export class TasksModule {}
