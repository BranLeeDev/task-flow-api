import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Team, User } from '@entities/index';
import { CreateTeamDto, UpdateTeamDto } from '../dtos/teams.dto';
import { UsersService } from './users.service';

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
      await this.addMembersToTeam(newTeam, createTeamDto.membersIds);
    }
    newTeam.leader = await this.usersService.findUserById(
      createTeamDto.leaderId,
    );
    const createdTeam = await this.teamRepo.save(newTeam);
    this.logger.log(`Team created successfully with ID ${createdTeam.id}`);
    return createdTeam;
  }

  async update(teamId: number, updateTeamDto: UpdateTeamDto) {
    this.logger.log(`Updating team with ID ${teamId}`);
    const teamFound = await this.findTeamById(teamId);
    if (updateTeamDto.leaderId) {
      const leader = await this.usersService.findUserById(
        updateTeamDto.leaderId,
      );
      teamFound.leader = leader;
    }
    if (updateTeamDto.membersIds) {
      await this.addMembersToTeam(teamFound, updateTeamDto.membersIds);
    }
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
    await this.validateUsersExist(idsList);
    const members = await this.userRepo.findBy({
      id: In(idsList),
    });
    team.members = members;
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
