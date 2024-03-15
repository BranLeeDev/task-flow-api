import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
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

  @Get(':teamId')
  async findOne(@Param('teamId', ParseIntPipe) teamId: number) {
    const res = await this.teamsService.findOne(teamId);
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
