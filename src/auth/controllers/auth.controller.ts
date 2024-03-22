import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FastifyReply } from 'fastify';
import { LoginService } from '../services/login.service';
import { UsersService } from 'src/users/services/users.service';
import { FastifyRequest } from '../models/request.model';
import { LogoutService } from '../services/logout.service';
import { Public } from '../decorators/public.decorator';
import { EmailConfirmationService } from 'src/emails/services/email-confirmation.service';
import { CreateUserDto } from 'src/users/dtos/users.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly logoutService: LogoutService,
    private readonly usersService: UsersService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('sign-in')
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

  @Public()
  @Post('sign-up')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    await this.emailConfirmationService.sendVerificationLink(user.email);
    return {
      message: 'User registered successfully',
      data: user,
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

  @UseGuards(AuthGuard('jwt'))
  @Post('log-out')
  async logOut(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const { user } = req;
    await this.usersService.removeRefreshToken(user.id);
    res.header('set-cookie', this.logoutService.getCookiesForLogout());
    return { message: 'User logged out successfully' };
  }
}
