import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/tasks.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll() {
    const res = await this.tasksService.findAll();
    return res;
  }

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    const res = await this.tasksService.create(createTaskDto);
    return {
      message: 'Task created successfully',
      data: res,
    };
  }

  @Get(':taskId')
  async findOne(@Param('taskId', ParseIntPipe) taskId: number) {
    const res = await this.tasksService.findOne(taskId);
    return res;
  }

  @Patch(':taskId')
  async update(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const res = await this.tasksService.update(taskId, updateTaskDto);
    return {
      message: 'Task updated successfully',
      data: res,
    };
  }

  @Delete(':taskId')
  async delete(@Param('taskId', ParseIntPipe) taskId: number) {
    const res = await this.tasksService.delete(taskId);
    return {
      message: 'Task deleted successfully',
      data: res,
    };
  }
}
