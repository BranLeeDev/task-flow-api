import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto } from '../dtos/tasks.dto';

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
}
