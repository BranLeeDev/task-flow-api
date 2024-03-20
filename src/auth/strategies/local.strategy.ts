import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LoginService } from '../services/login.service';
import { SignInDto } from '../dtos/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly loginService: LoginService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(signInDto: SignInDto) {
    const user = this.loginService.validateUser(signInDto);
    if (!user)
      throw new UnauthorizedException('Invalid credentials, please try again');
    return user;
  }
}
