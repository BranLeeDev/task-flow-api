import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Team, User } from '@entities/index';
import { CreateTeamDto } from '../dtos/teams.dto';

@Injectable()
export class TeamsService {
  private readonly logger = new Logger(TeamsService.name);

  constructor(
    @InjectRepository(Team) private readonly teamRepo: Repository<Team>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findAll() {
    this.logger.log('Fetching all teams');
    const teamsList = await this.teamRepo.find();
    this.logger.log('All teams fetched successfully');
    return teamsList;
  }

  async findTeamById(teamId: number) {
    this.logger.log(`Fetching team with ID ${teamId} without its relations`);
    const team = await this.teamRepo.findOneBy({ id: teamId });
    if (!team) {
      this.logger.error(`Not found the team with id #${teamId}`);
      throw new NotFoundException(`Not found team with id #${teamId}`);
    }
    this.logger.log(`Team with ID ${teamId} fetched successfully`);
    return team;
  }

  async findOne(teamId: number) {
    this.logger.log(`Fetching team with ID ${teamId} with its relations`);
    const team = await this.teamRepo.findOne({
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
    const newTeam = this.teamRepo.create(createTeamDto);
    if (createTeamDto.membersIds) {
      await this.validateUsersExist(createTeamDto.membersIds);
      const members = await this.userRepo.findBy({
        id: In(createTeamDto.membersIds),
      });
      newTeam.members = members;
    }
    const createdTeam = await this.teamRepo.save(newTeam);
    this.logger.log(`Team created successfully with ID ${createdTeam.id}`);
    return createdTeam;
  }

  private async validateUsersExist(idsList: number[]) {
    this.logger.log('Validating users existence');
    for (const id of idsList) {
      const user = await this.userRepo.findBy({ id });
      if (!user) {
        this.logger.error(`Not found the user with id #${id}`);
        throw new NotFoundException(`Not found the user with id #${id}`);
      }
    }
    this.logger.log('All users exist');
  }
}
