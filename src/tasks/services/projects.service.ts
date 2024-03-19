import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateProjectDto } from '../dtos/projects.dto';
import { Project } from '@entities/index';
import { UsersService } from 'src/users/services/users.service';
import { TeamsService } from 'src/users/services/teams.service';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    private readonly usersService: UsersService,
    private readonly teamsService: TeamsService,
  ) {}

  async findAll() {
    this.logger.log('Fetching all projects');
    const projectsList = await this.projectRepo.find();
    this.logger.log('All projects fetched successfully');
    return projectsList;
  }

  async create(createProjectDto: CreateProjectDto) {
    this.logger.log('Creating project');
    const newProject = this.projectRepo.create(createProjectDto);
    newProject.manager = await this.usersService.findUserById(
      createProjectDto.managerId,
    );
    newProject.team = await this.teamsService.findTeamById(
      createProjectDto.teamId,
    );
    const createdProject = await this.projectRepo.save(newProject);
    this.logger.log('Project created successfully with ID');
    return createdProject;
  }
}
