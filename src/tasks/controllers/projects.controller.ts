import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { CreateProjectDto, UpdateProjectDto } from '../dtos/projects.dto';
import { EmailConfirmationGuard } from 'src/auth/guards/email-confirmation.guard';

@UseGuards(EmailConfirmationGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAll() {
    const res = await this.projectsService.findAll();
    return res;
  }

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto) {
    const res = await this.projectsService.create(createProjectDto);
    return {
      message: 'Project created successfully',
      data: res,
    };
  }

  @Get(':projectId')
  async findOne(@Param('projectId', ParseIntPipe) projectId: number) {
    const res = await this.projectsService.findOne(projectId);
    return res;
  }

  @Patch(':projectId')
  async update(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const res = await this.projectsService.update(projectId, updateProjectDto);
    return {
      message: 'Project updated successfully',
      data: res,
    };
  }

  @Delete(':projectId')
  async delete(@Param('projectId', ParseIntPipe) projectId: number) {
    const res = await this.projectsService.delete(projectId);
    return {
      message: 'Project deleted successfully',
      data: res,
    };
  }
}
