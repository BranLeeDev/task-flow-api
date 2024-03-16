import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { TeamsService } from '../services/teams.service';
import { CreateTeamDto, UpdateTeamDto } from '../dtos/teams.dto';

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

  @Patch(':teamId')
  async update(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    const res = await this.teamsService.update(teamId, updateTeamDto);
    return {
      message: 'Team updated successfully',
      data: res,
    };
  }
}
