import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/services/users.service';
import { SignInDto } from '../dtos/login.dto';
import registersEnv from '@env/registers.env';
import { ConfigType } from '@nestjs/config';
import { PayloadToken } from '../models/token.model';
import { User } from '@entities/index';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(registersEnv.KEY)
    private readonly configService: ConfigType<typeof registersEnv>,
  ) {}

  async validateUser(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.usersService.findUserEmail(email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    return user;
  }

  getCookieWithJwtAccessToken(user: User) {
    const { accessTokenSecret, accessTokenExpirationTime } =
      this.configService.jwt;
    const payload: PayloadToken = { role: user.role, sub: user.id };
    const token = this.jwtService.sign(payload, {
      secret: accessTokenSecret,
      expiresIn: `${accessTokenExpirationTime}s`,
    });
    const secure = this.configService.isProd ? 'Secure' : '';
    const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${accessTokenExpirationTime}; ${secure}`;
    return cookie;
  }

  getCookieWithJwtRefreshToken(user: User) {
    const { refreshTokenSecret, refreshTokenExpirationTime } =
      this.configService.jwt;
    const payload: PayloadToken = { role: user.role, sub: user.id };
    const token = this.jwtService.sign(payload, {
      secret: refreshTokenSecret,
      expiresIn: `${refreshTokenExpirationTime}s`,
    });
    const secure = this.configService.isProd ? 'Secure' : '';
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${refreshTokenExpirationTime}; ${secure}`;
    return {
      cookie,
      token,
    };
  }
}
