import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TeamsService } from '../services/teams.service';
import { CreateTeamDto, UpdateTeamDto } from '../dtos/teams.dto';
import { EmailConfirmationGuard } from 'src/auth/guards/email-confirmation.guard';

@UseGuards(EmailConfirmationGuard)
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

  @Get(':teamId')
  async findOne(@Param('teamId', ParseIntPipe) teamId: number) {
    const res = await this.teamsService.findOne(teamId);
    return res;
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

  @Delete(':teamId')
  async delete(@Param('teamId', ParseIntPipe) teamId: number) {
    const res = await this.teamsService.delete(teamId);
    return {
      message: 'Team deleted successfully',
      data: res,
    };
  }
}
