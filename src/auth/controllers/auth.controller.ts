import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FastifyReply } from 'fastify';
import { LoginService } from '../services/login.service';
import { UsersService } from 'src/users/services/users.service';
import { FastifyRequest } from '../models/request.model';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async signIn(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const { user } = req;
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

  @UseGuards(AuthGuard('jwt-refresh-token'))
  @Get('refresh')
  refresh(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const accessTokenCookie = this.loginService.getCookieWithJwtAccessToken(
      req.user,
    );
    res.header('set-cookie', accessTokenCookie);
    return req.user;
  }
}
