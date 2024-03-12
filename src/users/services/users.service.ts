import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { User } from '@entities/users/user.entity';
import { CreateUserDto, FilterUserDto } from '../dtos/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findAll(filterUserDto?: FilterUserDto) {
    const options: FindManyOptions<User> = {
      relations: ['tasks'],
    };
    if (filterUserDto) {
      const { limit, offset, role } = filterUserDto;
      options.take = limit ?? 20;
      options.skip = offset ?? 0;
      options.where = {
        role,
      };
    }
    const usersList = await this.userRepo.find(options);
    return usersList;
  }

  async findUserById(userId: number) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user)
      throw new NotFoundException(`Not found the user with id #${userId}`);
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepo.create(createUserDto);
    const createdUser = await this.userRepo.save(newUser);
    return createdUser;
  }
}