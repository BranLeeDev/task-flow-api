import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto, FilterUserDto, UpdateUserDto } from '../dtos/users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() filterUserDto: FilterUserDto) {
    const res = await this.usersService.findAll(filterUserDto);
    return res;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const res = await this.usersService.create(createUserDto);
    return {
      message: 'User created successfully',
      data: res,
    };
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
