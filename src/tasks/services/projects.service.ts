import { Project } from '@entities/index';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    @InjectRepository(Project)
    private readonly projectsRepo: Repository<Project>,
  ) {}

  async findAll() {
    this.logger.log('Fetching all projects');
    const projectsList = await this.projectsRepo.find();
    this.logger.log('All projects fetched successfully');
    return projectsList;
  }
}
