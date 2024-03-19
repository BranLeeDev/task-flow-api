import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { CreateProjectDto } from '../dtos/projects.dto';

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
}
