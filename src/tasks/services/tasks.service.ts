import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '@entities/tasks/task.entity';
import { CreateTaskDto } from '../dtos/tasks.dto';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    private readonly usersService: UsersService,
  ) {}

  async findAll() {
    const tasksList = await this.taskRepo.find();
    return tasksList;
  }

  async create(createTaskDto: CreateTaskDto) {
    const newTask = this.taskRepo.create(createTaskDto);
    newTask.user = await this.usersService.findUserById(createTaskDto.userId);
    const createdTask = await this.taskRepo.save(newTask);
    return createdTask;
  }
}
