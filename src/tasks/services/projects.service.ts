import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateProjectDto, UpdateProjectDto } from '../dtos/projects.dto';
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

  async findProjectById(projectId: number) {
    this.logger.log(
      `Fetching project with ID ${projectId} without its relations`,
    );
    const project = await this.projectRepo.findOneBy({ id: projectId });
    if (!project) {
      this.logger.error(`Not found the project with id #${projectId}`);
      throw new NotFoundException(`Not found project with id #${projectId}`);
    }
    this.logger.log(`Project with ID ${projectId} fetched successfully`);
    return project;
  }

  async findOne(projectId: number) {
    this.logger.log(`Fetching project with ID ${projectId} with its relations`);
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: ['manager', 'team'],
    });
    if (!project) {
      this.logger.error(`Not found the project with id #${projectId}`);
      throw new NotFoundException(`Not found project with id #${projectId}`);
    }
    this.logger.log(`Project with ID ${projectId} fetched successfully`);
    return project;
  }

  async create(createProjectDto: CreateProjectDto) {
    this.logger.log('Creating project');
    const newProject = this.projectRepo.create(createProjectDto);
    newProject.team = await this.teamsService.findTeamById(
      createProjectDto.teamId,
    );
    const createdProject = await this.projectRepo.save(newProject);
    this.logger.log('Project created successfully with ID');
    return createdProject;
  }

  async update(projectId: number, updateProjectDto: UpdateProjectDto) {
    this.logger.log(`Updating project with ID ${projectId}`);
    const projectFound = await this.findProjectById(projectId);
    if (updateProjectDto.teamId) {
      projectFound.team = await this.teamsService.findTeamById(
        updateProjectDto.teamId,
      );
    }
    this.projectRepo.merge(projectFound, updateProjectDto);
    const updatedProject = await this.projectRepo.save(projectFound);
    this.logger.log(`Project with ID ${projectId} updated successfully`);
    return updatedProject;
  }

  async delete(projectId: number) {
    this.logger.log(`Deleting task with ID ${projectId}`);
    const projectToDelete = await this.findProjectById(projectId);
    await this.projectRepo.delete(projectId);
    this.logger.log(`Project with ID ${projectId} deleted successfully`);
    return projectToDelete;
  }
}
