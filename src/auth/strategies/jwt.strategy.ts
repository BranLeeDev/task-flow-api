import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PayloadToken } from '../models/token.model';
import { UsersService } from 'src/users/services/users.service';
import { ConfigType } from '@nestjs/config';
import registersEnv from '@env/registers.env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(registersEnv.KEY)
    private readonly configService: ConfigType<typeof registersEnv>,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: { cookies: Record<string, string> }) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: configService.jwt.accessTokenSecret,
    });
  }

  async validate(payload: PayloadToken) {
    const user = await this.usersService.findUserById(payload.sub);
    return user;
  }
}
