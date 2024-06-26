import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, QueryFailedError, Repository } from 'typeorm';
import { Team, User } from '@entities/index';
import { CreateTeamDto, UpdateTeamDto } from '../dtos/teams.dto';
import { UsersService } from './users.service';
import { UserRoles } from '@models/user.model';

@Injectable()
export class TeamsService {
  private readonly logger = new Logger(TeamsService.name);

  constructor(
    @InjectRepository(Team) private readonly teamRepo: Repository<Team>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly usersService: UsersService,
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
      relations: ['members', 'leader'],
    });
    if (!team) {
      this.logger.error(`Not found the team with id #${teamId}`);
      throw new NotFoundException(`Not found team with id #${teamId}`);
    }
    this.logger.log(`Team with ID ${teamId} fetched successfully`);
    return team;
  }

  async create(createTeamDto: CreateTeamDto, leaderId: number) {
    try {
      this.logger.log('Creating team');
      const newTeam = this.teamRepo.create(createTeamDto);
      newTeam.leader = await this.usersService.findUserById(leaderId);
      const createdTeam = await this.teamRepo.save(newTeam);
      this.logger.log(`Team created successfully with ID ${createdTeam.id}`);
      return createdTeam;
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.message.includes('UQ_10c8e335dc32010ef90abe65cec')
      ) {
        throw new ConflictException(
          'Team creation failed due to duplicate key',
        );
      }
      throw error;
    }
  }

  async update(teamId: number, updateTeamDto: UpdateTeamDto) {
    this.logger.log(`Updating team with ID ${teamId}`);
    const teamFound = await this.findTeamById(teamId);
    this.teamRepo.merge(teamFound, updateTeamDto);
    const updatedTeam = await this.teamRepo.save(teamFound);
    this.logger.log(`Team with ID ${teamId} updated successfully`);
    return updatedTeam;
  }

  async delete(teamId: number) {
    this.logger.log(`Deleting team with ID ${teamId}`);
    const teamToDelete = await this.findTeamById(teamId);
    await this.teamRepo.delete(teamId);
    this.logger.log(`Team with ID ${teamId} deleted successfully`);
    return teamToDelete;
  }

  private async addMembersToTeam(team: Team, idsList: number[]) {
    await this.validateUsers(idsList);
    const members = await this.userRepo.findBy({
      id: In(idsList),
    });
    team.members = members;
  }

  private async validateUsers(idsList: number[]) {
    this.logger.log('Validating users existence');
    for (const id of idsList) {
      const user = await this.userRepo.findOneBy({ id });
      if (!user) {
        this.logger.error(`Not found the user with id #${id}`);
        throw new NotFoundException(`Not found the user with id #${id}`);
      }
      if (user.role !== UserRoles.TeamMember) {
        throw new BadRequestException('Only Team Members are allowed to join');
      }
    }
    this.logger.log('All users exist');
  }
}
