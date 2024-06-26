import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Task } from '@entities/tasks/task.entity';
import { CreateTaskDto, FilterTaskDto, UpdateTaskDto } from '../dtos/tasks.dto';
import { UsersService } from 'src/users/services/users.service';
import { TaskStatus } from '@models/task.model';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    private readonly usersService: UsersService,
  ) {}

  async findAll(filterTaskDto?: FilterTaskDto) {
    this.logger.log('Fetching all tasks');
    const options: FindManyOptions<Task> = {};
    if (filterTaskDto) {
      const { status, priority } = filterTaskDto;
      options.where = {
        status,
        priority,
      };
    }
    const tasksList = await this.taskRepo.find(options);
    this.logger.log('All tasks fetched successfully');
    return tasksList;
  }

  async findTaskById(taskId: number) {
    this.logger.log(`Fetching task with ID ${taskId} without its relations`);
    const task = await this.taskRepo.findOneBy({ id: taskId });
    if (!task) {
      this.logger.error(`Not found the task with id #${taskId}`);
      throw new NotFoundException(`Not found task with id #${taskId}`);
    }
    this.logger.log(`Task with ID ${taskId} fetched successfully`);
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
    this.logger.log(`Task with ID ${taskId} fetched successfully`);
    return task;
  }

  async countPendingTasks(userId: number) {
    const total = await this.taskRepo.countBy({
      user: { id: userId },
      status: TaskStatus.Pending,
    });
    return total;
  }

  async countInProgressTasks(userId: number) {
    const total = await this.taskRepo.countBy({
      user: { id: userId },
      status: TaskStatus.InProgress,
    });
    return total;
  }

  async create(createTaskDto: CreateTaskDto, userId: number) {
    this.logger.log('Creating task');
    const newTask = this.taskRepo.create(createTaskDto);
    newTask.user = await this.usersService.findUserById(userId);
    const createdTask = await this.taskRepo.save(newTask);
    this.logger.log(`Task created successfully with ID ${createdTask.id}`);
    return createdTask;
  }

  async update(taskId: number, updateTaskDto: UpdateTaskDto) {
    this.logger.log(`Updating task with ID ${taskId}`);
    const taskFound = await this.findTaskById(taskId);
    this.taskRepo.merge(taskFound, updateTaskDto);
    const updatedTask = await this.taskRepo.save(taskFound);
    this.logger.log(`Task with ID ${taskId} updated successfully`);
    return updatedTask;
  }

  async delete(taskId: number) {
    this.logger.log(`Deleting task with ID ${taskId}`);
    const taskToDelete = await this.findTaskById(taskId);
    await this.taskRepo.delete(taskId);
    this.logger.log(`Task with ID ${taskId} deleted successfully`);
    return taskToDelete;
  }
}
