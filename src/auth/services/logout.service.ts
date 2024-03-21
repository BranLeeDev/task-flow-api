import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import registersEnv from '@env/registers.env';

@Injectable()
export class LogoutService {
  constructor(
    @Inject(registersEnv.KEY)
    private readonly config: ConfigType<typeof registersEnv>,
  ) {}

  getCookiesForLogout(): string[] {
    const { isProd } = this.config;
    const secure = isProd ? 'Secure' : '';

    return [
      `Authentication=; HttpOnly; Path=/; Max-Age=0; ${secure}`,
      `Refresh=; HttpOnly; Path=/; Max-Age=0; ${secure}`,
    ];
  }
}
