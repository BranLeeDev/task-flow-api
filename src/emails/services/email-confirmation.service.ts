import registersEnv from '@env/registers.env';
import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { VerificationToken } from 'src/auth/models/token.model';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    @Inject(registersEnv.KEY)
    private readonly configService: ConfigType<typeof registersEnv>,
    private readonly usersService: UsersService,
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
        token,
      },
    });
  }

  async resendConfirmationLink(userId: number) {
    const user = await this.usersService.findUserById(userId);
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.sendVerificationLink(user.email);
  }

  async confirmEmail(email: string) {
    const user = await this.usersService.findUserByEmail(email);
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.usersService.markEmailAsConfirmed(email);
  }

  async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.jwt.verificationTokenSecret,
      });
      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }
}
