import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FastifyReply } from 'fastify';
import { SignInDto } from '../dtos/login.dto';
import { LoginService } from '../services/login.service';
import { UsersService } from 'src/users/services/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const user = await this.usersService.findUserByEmail(signInDto.email);
    const accessTokenCookie =
      this.loginService.getCookieWithJwtAccessToken(user);
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.loginService.getCookieWithJwtRefreshToken(user);
    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);
    res.header('set-cookie', [accessTokenCookie, refreshTokenCookie]);
    return {
      user,
      cookies: {
        accessTokenCookie,
        refreshTokenCookie,
      },
    };
  }
}
