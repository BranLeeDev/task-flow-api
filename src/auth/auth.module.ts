import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LoginService } from './services/login.service';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';

@Module({
  imports: [UsersModule, PassportModule, JwtModule],
  providers: [LoginService, LocalStrategy, JwtRefreshTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
