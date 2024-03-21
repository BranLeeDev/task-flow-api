import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/services/users.service';
import { PayloadToken } from '../models/token.model';
import registersEnv from '@env/registers.env';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    @Inject(registersEnv.KEY)
    private readonly configService: ConfigType<typeof registersEnv>,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: { cookies: Record<string, string> }) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: configService.jwt.refreshTokenSecret,
      passReqToCallback: true,
    });
  }

  async validate(
    request: { cookies: Record<string, string> },
    payload: PayloadToken,
  ) {
    const refreshToken = request?.cookies?.Refresh;
    const user = await this.usersService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.sub,
    );
    return user;
  }
}
