import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LoginService } from './services/login.service';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule, PassportModule],
  providers: [LoginService],
  controllers: [AuthController],
})
export class AuthModule {}
