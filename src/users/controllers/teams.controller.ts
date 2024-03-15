import { Body, Controller, Get, Post } from '@nestjs/common';
import { TeamsService } from '../services/teams.service';
import { CreateTeamDto } from '../dtos/teams.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  async findAll() {
    const res = await this.teamsService.findAll();
    return res;
  }

  @Post()
  async create(@Body() createTeamDto: CreateTeamDto) {
    const res = await this.teamsService.create(createTeamDto);
    return {
      message: 'Team created successfully',
      data: res,
    };
  }
}
