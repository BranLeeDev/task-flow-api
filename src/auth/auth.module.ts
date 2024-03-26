import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LoginService } from './services/login.service';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';
import { LogoutService } from './services/logout.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { EmailsModule } from 'src/emails/emails.module';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [UsersModule, PassportModule, JwtModule, EmailsModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    LoginService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    LogoutService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
