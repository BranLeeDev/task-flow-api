import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto, FilterUserDto } from '../dtos/users.dto';

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
}
