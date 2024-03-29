import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { FilterUserDto, UpdateUserDto } from '../dtos/users.dto';
import { EmailConfirmationGuard } from 'src/auth/guards/email-confirmation.guard';
import { FastifyRequest } from 'src/auth/models/request.model';
import { Actions, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { FastifyReply } from 'fastify';
import { Public } from 'src/auth/decorators/public.decorator';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Public()
  @Get()
  async findAll(@Query() filterUserDto: FilterUserDto) {
    const key = 'users-find-all';
    const usersCached = await this.cacheManager.get(key);
    if (usersCached) return usersCached;
    const res = await this.usersService.findAll(filterUserDto);
    this.cacheManager.set(key, res, 5000);
    return res;
  }

  @UseGuards(EmailConfirmationGuard)
  @Get('my-profile')
  async getMyProfile(@Req() req: FastifyRequest) {
    const user = req.user;
    const profile = await this.usersService.findOne(user.id);
    return profile;
  }

  @UseGuards(EmailConfirmationGuard)
  @Get(':userId')
  async findOne(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: FastifyRequest,
  ) {
    const user = req.user;
    const ability = this.caslAbilityFactory.defineAbilityFor(user);
    const res = await this.usersService.findOne(userId);
    const isAllowed = ability.can(Actions.Read, res);
    if (!isAllowed) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }
    return res;
  }

  @UseGuards(EmailConfirmationGuard)
  @Patch(':userId')
  async update(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: FastifyRequest,
  ) {
    const user = req.user;
    const ability = this.caslAbilityFactory.defineAbilityFor(user);
    const userToUpdate = await this.usersService.findUserById(userId);
    const isAllowed = ability.can(Actions.Update, userToUpdate);
    if (!isAllowed) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }
    const res = await this.usersService.update(userId, updateUserDto);
    return {
      message: 'User updated successfully',
      data: res,
    };
  }

  @UseGuards(EmailConfirmationGuard)
  @Delete(':userId')
  async delete(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const user = req.user;
    const ability = this.caslAbilityFactory.defineAbilityFor(user);
    const userFound = await this.usersService.findUserById(userId);
    const isAllowed = ability.can(Actions.Delete, userFound);
    if (!isAllowed) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }
    const userDeleted = await this.usersService.delete(userId);
    res.header('set-cookie', this.usersService.resetCookies());
    return {
      message: 'User deleted successfully',
      data: userDeleted,
    };
  }
}
