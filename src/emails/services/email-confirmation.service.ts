import registersEnv from '@env/registers.env';
import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { VerificationToken } from 'src/auth/models/token.model';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    @Inject(registersEnv.KEY)
    private readonly configService: ConfigType<typeof registersEnv>,
  ) {}

  async sendVerificationLink(email: string) {
    const { verificationTokenSecret, verificationTokenExpirationTime } =
      this.configService.jwt;
    const { confirmationUrl } = this.configService.email;
    const payload: VerificationToken = { email };
    const token = this.jwtService.sign(payload, {
      secret: verificationTokenSecret,
      expiresIn: `${verificationTokenExpirationTime}s`,
    });
    const url = `${confirmationUrl}?token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Task Flow! Confirm your email',
      template: './confirmation',
      context: {
        name: email.split('@')[0],
        url,
      },
    });
  }
}
