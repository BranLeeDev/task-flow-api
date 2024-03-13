import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '@entities/tasks/task.entity';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/tasks.dto';
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

  async findTaskById(taskId: number) {
    const task = await this.taskRepo.findOneBy({ id: taskId });
    if (!task) throw new NotFoundException(`Not found task with id #${taskId}`);
    return task;
  }

  async findOne(taskId: number) {
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: ['user'],
    });
    if (!task) throw new NotFoundException(`Not found task with id #${taskId}`);
    return task;
  }

  async create(createTaskDto: CreateTaskDto) {
    const newTask = this.taskRepo.create(createTaskDto);
    newTask.user = await this.usersService.findUserById(createTaskDto.userId);
    const createdTask = await this.taskRepo.save(newTask);
    return createdTask;
  }

  async update(taskId: number, updateTaskDto: UpdateTaskDto) {
    const taskFound = await this.findTaskById(taskId);
    this.taskRepo.merge(taskFound, updateTaskDto);
    const updatedTask = await this.taskRepo.save(taskFound);
    return updatedTask;
  }

  async delete(taskId: number) {
    const taskToDelete = await this.findTaskById(taskId);
    await this.taskRepo.delete(taskId);
    return taskToDelete;
  }
}
