import { User } from '@entities/users/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findAll() {
    const usersList = await this.userRepo.find();
    return usersList;
  }

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepo.create(createUserDto);
    const createdUser = await this.userRepo.save(newUser);
    return createdUser;
  }
}
