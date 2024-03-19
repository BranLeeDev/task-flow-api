import { Module } from '@nestjs/common';
import { LoginService } from './services/login.service';

@Module({
  providers: [LoginService],
})
export class AuthModule {}
