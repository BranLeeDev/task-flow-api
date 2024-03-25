import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { FilterUserDto, UpdateUserDto } from '../dtos/users.dto';
import { EmailConfirmationGuard } from 'src/auth/guards/email-confirmation.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from '@models/user.model';

@UseGuards(EmailConfirmationGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRoles.Administrator)
  @Get()
  async findAll(@Query() filterUserDto: FilterUserDto) {
    const res = await this.usersService.findAll(filterUserDto);
    return res;
  }

  @Get(':userId')
  async findOne(@Param('userId', ParseIntPipe) userId: number) {
    const res = await this.usersService.findOne(userId);
    return res;
  }

  @Patch(':userId')
  async update(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const res = await this.usersService.update(userId, updateUserDto);
    return {
      message: 'User updated successfully',
      data: res,
    };
  }

  @Delete(':userId')
  async delete(@Param('userId', ParseIntPipe) userId: number) {
    const res = await this.usersService.delete(userId);
    return {
      message: 'User deleted successfully',
      data: res,
    };
  }
}
