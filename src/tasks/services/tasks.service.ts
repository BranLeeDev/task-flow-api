import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '@entities/tasks/task.entity';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/tasks.dto';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    private readonly usersService: UsersService,
  ) {}

  async findAll() {
    this.logger.log('Fetching all tasks');
    const tasksList = await this.taskRepo.find();
    return tasksList;
  }

  async findTaskById(taskId: number) {
    this.logger.log(`Fetching task with ID ${taskId} without its relations`);
    const task = await this.taskRepo.findOneBy({ id: taskId });
    if (!task) {
      this.logger.error(`Not found the task with id #${taskId}`);
      throw new NotFoundException(`Not found task with id #${taskId}`);
    }
    return task;
  }

  async findOne(taskId: number) {
    this.logger.log(`Fetching task with ID ${taskId} with its relations`);
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: ['user'],
    });
    if (!task) {
      this.logger.error(`Not found the task with id #${taskId}`);
      throw new NotFoundException(`Not found task with id #${taskId}`);
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto) {
    this.logger.log('Creating user');
    const newTask = this.taskRepo.create(createTaskDto);
    newTask.user = await this.usersService.findUserById(createTaskDto.userId);
    const createdTask = await this.taskRepo.save(newTask);
    return createdTask;
  }

  async update(taskId: number, updateTaskDto: UpdateTaskDto) {
    this.logger.log(`Updating task with ID ${taskId}`);
    const taskFound = await this.findTaskById(taskId);
    this.taskRepo.merge(taskFound, updateTaskDto);
    const updatedTask = await this.taskRepo.save(taskFound);
    return updatedTask;
  }

  async delete(taskId: number) {
    this.logger.log(`Deleting task with ID ${taskId}`);
    const taskToDelete = await this.findTaskById(taskId);
    await this.taskRepo.delete(taskId);
    return taskToDelete;
  }
}
