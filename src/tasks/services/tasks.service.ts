import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '@entities/tasks/task.entity';
import { CreateTaskDto } from '../dtos/tasks.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
  ) {}

  async findAll() {
    const tasksList = await this.taskRepo.find();
    return tasksList;
  }

  async create(createTaskDto: CreateTaskDto) {
    const newTask = this.taskRepo.create(createTaskDto);
    const createdTask = await this.taskRepo.save(newTask);
    return createdTask;
  }
}
