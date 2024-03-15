import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '@entities/index';
import { CreateTeamDto } from '../dtos/teams.dto';

@Injectable()
export class TeamsService {
  private readonly logger = new Logger(TeamsService.name);

  constructor(
    @InjectRepository(Team) private readonly teamsRepo: Repository<Team>,
  ) {}

  async findAll() {
    this.logger.log('Fetching all teams');
    const teamsList = await this.teamsRepo.find();
    this.logger.log('All teams fetched successfully');
    return teamsList;
  }

  async findTeamById(teamId: number) {
    this.logger.log(`Fetching team with ID ${teamId} without its relations`);
    const team = await this.teamsRepo.findOneBy({ id: teamId });
    if (!team) {
      this.logger.error(`Not found the team with id #${teamId}`);
      throw new NotFoundException(`Not found team with id #${teamId}`);
    }
    this.logger.log(`Team with ID ${teamId} fetched successfully`);
    return team;
  }

  async findOne(teamId: number) {
    this.logger.log(`Fetching team with ID ${teamId} with its relations`);
    const team = await this.teamsRepo.findOne({
      where: { id: teamId },
      relations: ['projects', 'members'],
    });
    if (!team) {
      this.logger.error(`Not found the team with id #${teamId}`);
      throw new NotFoundException(`Not found team with id #${teamId}`);
    }
    this.logger.log(`Team with ID ${teamId} fetched successfully`);
    return team;
  }

  async create(createTeamDto: CreateTeamDto) {
    this.logger.log('Creating team');
    const newTeam = this.teamsRepo.create(createTeamDto);
    const createdTeam = await this.teamsRepo.save(newTeam);
    this.logger.log(`Team created successfully with ID ${createdTeam.id}`);
    return createdTeam;
  }
}
