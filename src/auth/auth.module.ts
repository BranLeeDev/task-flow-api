import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LoginService } from './services/login.service';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';
import { LogoutService } from './services/logout.service';

@Module({
  imports: [UsersModule, PassportModule, JwtModule],
  providers: [
    LoginService,
    LocalStrategy,
    JwtRefreshTokenStrategy,
    LogoutService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
