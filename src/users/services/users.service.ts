import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '@entities/users/user.entity';
import { CreateUserDto, FilterUserDto, UpdateUserDto } from '../dtos/users.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findAll(filterUserDto?: FilterUserDto) {
    this.logger.log('Fetching all users');
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
    this.logger.log('All users fetched successfully');
    return usersList;
  }

  async findUserById(userId: number) {
    this.logger.log(`Fetching user with ID ${userId} without its relations`);
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      this.logger.error(`Not found the user with id #${userId}`);
      throw new NotFoundException(`Not found the user with id #${userId}`);
    }
    this.logger.log(`User with ID ${userId} fetched successfully`);
    return user;
  }

  async findOne(userId: number) {
    this.logger.log(`Fetching user with ID ${userId} with its relations`);
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['tasks', 'teams', 'userProjects'],
    });
    if (!user) {
      this.logger.error(`Not found the user with id #${userId}`);
      throw new NotFoundException(`Not found the user with id #${userId}`);
    }
    this.logger.log(`User with ID ${userId} fetched successfully`);
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    this.logger.log('Creating user');
    const newUser = this.userRepo.create(createUserDto);
    const hashPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashPassword;
    const createdUser = await this.userRepo.save(newUser);
    this.logger.log(`User created successfully with ID ${createdUser.id}`);
    return createdUser;
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    this.logger.log(`Updating user with ID ${userId}`);
    const userFound = await this.findUserById(userId);
    this.userRepo.merge(userFound, updateUserDto);
    const updatedUser = await this.userRepo.save(userFound);
    this.logger.log(`User with ID ${userId} updated successfully`);
    return updatedUser;
  }

  async delete(userId: number) {
    this.logger.log(`Deleting user with ID ${userId}`);
    const userToDelete = await this.findUserById(userId);
    await this.userRepo.delete(userId);
    this.logger.log(`User with ID ${userId} deleted successfully`);
    return userToDelete;
  }
}
