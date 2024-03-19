import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Users
import { User } from '@entities/users/user.entity';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';

// Teams
import { Team } from '@entities/index';
import { TeamsService } from './services/teams.service';
import { TeamsController } from './controllers/teams.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Team])],
  providers: [UsersService, TeamsService],
  controllers: [UsersController, TeamsController],
  exports: [UsersService, TeamsService],
})
export class UsersModule {}
