import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TeamsService } from '../services/teams.service';
import { CreateTeamDto, UpdateTeamDto } from '../dtos/teams.dto';
import { EmailConfirmationGuard } from 'src/auth/guards/email-confirmation.guard';
import { Actions, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { FastifyRequest } from 'src/auth/models/request.model';
import { Team } from '@entities/index';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from '@models/user.model';

@UseGuards(EmailConfirmationGuard)
@Controller('teams')
export class TeamsController {
  constructor(
    private readonly teamsService: TeamsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Roles(UserRoles.Administrator)
  @Get()
  async findAll() {
    const res = await this.teamsService.findAll();
    return res;
  }

  @Post()
  async create(
    @Body() createTeamDto: CreateTeamDto,
    @Req() req: FastifyRequest,
  ) {
    const user = req.user;
    const ability = this.caslAbilityFactory.defineAbilityFor(user);
    const isAllowed = ability.can(Actions.Create, Team);
    if (!isAllowed) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }
    const res = await this.teamsService.create(createTeamDto, user.id);
    return {
      message: 'Team created successfully',
      data: res,
    };
  }

  @Get(':teamId')
  async findOne(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Req() req: FastifyRequest,
  ) {
    const user = req.user;
    const ability = this.caslAbilityFactory.defineAbilityFor(user);
    const teamFound = await this.teamsService.findOne(teamId);
    const isAllowed = ability.can(Actions.Read, teamFound.leader);
    console.log(isAllowed);
    if (!isAllowed) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }
    return teamFound;
  }

  @Patch(':teamId')
  async update(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Body() updateTeamDto: UpdateTeamDto,
    @Req() req: FastifyRequest,
  ) {
    const user = req.user;
    const ability = this.caslAbilityFactory.defineAbilityFor(user);
    const teamToUpdate = await this.teamsService.findOne(teamId);
    const isAllowed = ability.can(Actions.Update, teamToUpdate.leader);
    if (!isAllowed) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }
    const res = await this.teamsService.update(teamId, updateTeamDto);
    return {
      message: 'Team updated successfully',
      data: res,
    };
  }

  @Delete(':teamId')
  async delete(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Req() req: FastifyRequest,
  ) {
    const user = req.user;
    const ability = this.caslAbilityFactory.defineAbilityFor(user);
    const teamToDelete = await this.teamsService.findOne(teamId);
    const isAllowed = ability.can(Actions.Delete, teamToDelete.leader);
    if (!isAllowed) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }
    const res = await this.teamsService.delete(teamId);
    return {
      message: 'Team deleted successfully',
      data: res,
    };
  }
}
