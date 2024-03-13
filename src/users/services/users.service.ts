import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '@entities/users/user.entity';
import { CreateUserDto, FilterUserDto, UpdateUserDto } from '../dtos/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findAll(filterUserDto?: FilterUserDto) {
    const options: FindManyOptions<User> = {};
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

  async findOne(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['tasks', 'teams', 'userProjects'],
    });
    if (!user)
      throw new NotFoundException(`Not found the user with id #${userId}`);
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepo.create(createUserDto);
    const hashPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashPassword;
    const createdUser = await this.userRepo.save(newUser);
    return createdUser;
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    const userFound = await this.findUserById(userId);
    this.userRepo.merge(userFound, updateUserDto);
    const updatedUser = await this.userRepo.save(userFound);
    return updatedUser;
  }

  async delete(userId: number) {
    const userToDelete = await this.findUserById(userId);
    await this.userRepo.delete(userId);
    return userToDelete;
  }
}
