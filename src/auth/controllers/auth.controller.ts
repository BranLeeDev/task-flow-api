import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SignInDto } from '../dtos/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoginService } from '../services/login.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginsService: LoginService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    const res = await this.loginsService.validateUser(signInDto);
    return res;
  }
}
