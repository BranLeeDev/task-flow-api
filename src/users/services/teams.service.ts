import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '@entities/index';

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
}
