import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '@entities/users/user.entity';
import { CreateUserDto, FilterUserDto, UpdateUserDto } from '../dtos/users.dto';
import registersEnv from '@env/registers.env';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @Inject(registersEnv.KEY)
    private readonly configService: ConfigType<typeof registersEnv>,
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

  async findUserByEmail(email: string) {
    this.logger.log(`Fetching user with email: ${email}`);
    const user = await this.userRepo.findOneBy({ email });
    if (!user) {
      this.logger.error(`User with email: ${email} not found`);
      throw new NotFoundException(`User with email: ${email} not found`);
    }
    this.logger.log(`User with email: ${email} fetched successfully`);
    return user;
  }

  async findUserEmail(email: string) {
    const user = await this.userRepo.findOneBy({ email });
    return user;
  }

  async findOne(userId: number) {
    this.logger.log(`Fetching user with ID ${userId} with its relations`);
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['tasks', 'teams', 'leader'],
    });
    if (!user) {
      this.logger.error(`Not found the user with id #${userId}`);
      throw new NotFoundException(`Not found the user with id #${userId}`);
    }
    this.logger.log(`User with ID ${userId} fetched successfully`);
    return user;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepo.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    this.logger.log('Attempting to validate refresh token...');
    const user = await this.findUserById(userId);
    if (!user.currentHashedRefreshToken) {
      this.logger.error('User does not have a refresh token');
      throw new NotFoundException('User does not have a refresh token');
    }
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );
    if (!isRefreshTokenMatching) {
      this.logger.error('Refresh token does not match');
      throw new BadRequestException('Refresh token does not match');
    }
    this.logger.log('Refresh token validation successful');
    return user;
  }

  async removeRefreshToken(userId: number) {
    await this.userRepo.update(userId, {
      currentHashedRefreshToken: null,
    });
  }

  async markEmailAsConfirmed(email: string) {
    await this.userRepo.update(
      { email },
      {
        isEmailConfirmed: true,
      },
    );
  }

  async updatePassword(email: string, password: string) {
    await this.userRepo.update(
      {
        email,
      },
      {
        password,
      },
    );
  }

  async create(createUserDto: CreateUserDto) {
    try {
      this.logger.log('Creating user');
      const newUser = this.userRepo.create(createUserDto);
      const hashPassword = await bcrypt.hash(newUser.password, 10);
      newUser.password = hashPassword;
      if (createUserDto.masterPassword) {
        if (
          createUserDto.masterPassword !== this.configService.masterPassword
        ) {
          throw new UnauthorizedException(
            'Unauthorized: Master password is incorrect',
          );
        }
      }
      const createdUser = await this.userRepo.save(newUser);
      this.logger.log(`User created successfully with ID ${createdUser.id}`);
      return createdUser;
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.message.includes('UQ_97672ac88f789774dd47f7c8be3')
      ) {
        throw new ConflictException('Registration failed due to data conflict');
      }
      throw error;
    }
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

  resetCookies() {
    const { isProd } = this.configService;
    const secure = isProd ? 'Secure' : '';

    return [
      `Authentication=; HttpOnly; Path=/; Max-Age=0; ${secure}`,
      `Refresh=; HttpOnly; Path=/; Max-Age=0; ${secure}`,
    ];
  }
}
