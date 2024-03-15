import { Controller, Get } from '@nestjs/common';
import { TeamsService } from '../services/teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  async findAll() {
    const res = await this.teamsService.findAll();
    return res;
  }
}
