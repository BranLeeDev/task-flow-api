import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto, FilterTaskDto, UpdateTaskDto } from '../dtos/tasks.dto';
import { EmailConfirmationGuard } from 'src/auth/guards/email-confirmation.guard';
import { Actions, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from '@models/user.model';
import { UsersService } from 'src/users/services/users.service';
import { FastifyRequest } from 'src/auth/models/request.model';
import { Task } from '@entities/index';

@UseGuards(EmailConfirmationGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly usersService: UsersService,
  ) {}

  @Roles(UserRoles.Administrator)
  @Get()
  async findAll(@Query() filterTaskDto: FilterTaskDto) {
    const res = await this.tasksService.findAll(filterTaskDto);
    return res;
  }

  @Get('my-tasks')
  async getMyTasks(@Req() req: FastifyRequest) {
    const user = req.user;
    const userFound = await this.usersService.findOne(user.id);
    return userFound.tasks;
  }

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: FastifyRequest,
  ) {
    const user = req.user;
    const ability = this.caslAbilityFactory.defineAbilityFor(user);
    const isAllowed = ability.can(Actions.Create, Task);
    if (!isAllowed) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }
    const res = await this.tasksService.create(createTaskDto, user.id);
    return {
      message: 'Task created successfully',
      data: res,
    };
  }

  @Get(':taskId')
  async findOne(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Req() req: FastifyRequest,
  ) {
    const user = req.user;
    const ability = this.caslAbilityFactory.defineAbilityFor(user);
    const taskFound = await this.tasksService.findOne(taskId);
    const isAllowed = ability.can(Actions.Read, taskFound.user);
    if (!isAllowed) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }
    return taskFound;
  }

  @Patch(':taskId')
  async update(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: FastifyRequest,
  ) {
    const user = req.user;
    const ability = this.caslAbilityFactory.defineAbilityFor(user);
    const taskToUpdate = await this.tasksService.findOne(taskId);
    const isAllowed = ability.can(Actions.Update, taskToUpdate.user);
    if (!isAllowed) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }
    const res = await this.tasksService.update(taskId, updateTaskDto);
    return {
      message: 'Task updated successfully',
      data: res,
    };
  }

  @Delete(':taskId')
  async delete(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Req() req: FastifyRequest,
  ) {
    const user = req.user;
    const ability = this.caslAbilityFactory.defineAbilityFor(user);
    const taskToDelete = await this.tasksService.findOne(taskId);
    const isAllowed = ability.can(Actions.Delete, taskToDelete.user);
    if (!isAllowed) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }
    const res = await this.tasksService.delete(taskId);
    return {
      message: 'Task deleted successfully',
      data: res,
    };
  }
}
