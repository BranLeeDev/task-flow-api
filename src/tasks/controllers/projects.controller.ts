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
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { CreateProjectDto, UpdateProjectDto } from '../dtos/projects.dto';
import { EmailConfirmationGuard } from 'src/auth/guards/email-confirmation.guard';
import { Actions, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from '@models/user.model';
import { FastifyRequest } from 'src/auth/models/request.model';
import { Project } from '@entities/index';
import { UsersService } from 'src/users/services/users.service';

@UseGuards(EmailConfirmationGuard)
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly userService: UsersService,
  ) {}

  @Roles(UserRoles.Administrator)
  @Get()
  async findAll() {
    const res = await this.projectsService.findAll();
    return res;
  }

  @Get('my-projects')
  async getMyProjects(@Req() req: FastifyRequest) {
    const user = req.user;
    const userFound = await this.userService.findOne(user.id);
    return userFound.projects;
  }

  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: FastifyRequest,
  ) {
    const user = req.user;
    const ability = this.caslAbilityFactory.defineAbilityFor(user);
    const isAllowed = ability.can(Actions.Create, Project);
    if (!isAllowed) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }
    const res = await this.projectsService.create(createProjectDto, user.id);
    return {
      message: 'Project created successfully',
      data: res,
    };
  }

  @Get(':projectId')
  async findOne(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Req() req: FastifyRequest,
  ) {
    const user = req.user;
    const ability = this.caslAbilityFactory.defineAbilityFor(user);
    const projectFound = await this.projectsService.findOne(projectId);
    const isAllowed = ability.can(Actions.Read, projectFound.user);
    if (!isAllowed) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }
    return projectFound;
  }

  @Patch(':projectId')
  async update(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req: FastifyRequest,
  ) {
    const user = req.user;
    const ability = this.caslAbilityFactory.defineAbilityFor(user);
    const projectFound = await this.projectsService.findOne(projectId);
    const isAllowed = ability.can(Actions.Update, projectFound.user);
    if (!isAllowed) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }
    const res = await this.projectsService.update(projectId, updateProjectDto);
    return {
      message: 'Project updated successfully',
      data: res,
    };
  }

  @Delete(':projectId')
  async delete(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Req() req: FastifyRequest,
  ) {
    const user = req.user;
    const ability = this.caslAbilityFactory.defineAbilityFor(user);
    const projectFound = await this.projectsService.findOne(projectId);
    const isAllowed = ability.can(Actions.Delete, projectFound.user);
    if (!isAllowed) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }
    const res = await this.projectsService.delete(projectId);
    return {
      message: 'Project deleted successfully',
      data: res,
    };
  }
}
