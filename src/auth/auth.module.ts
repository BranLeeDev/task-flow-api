import { Module } from '@nestjs/common';
import { LoginService } from './services/login.service';
import { AuthController } from './controllers/auth.controller';

@Module({
  providers: [LoginService],
  controllers: [AuthController],
})
export class AuthModule {}
