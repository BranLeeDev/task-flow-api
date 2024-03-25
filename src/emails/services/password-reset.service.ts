import registersEnv from '@env/registers.env';
import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RecoveryToken } from 'src/auth/models/token.model';
import { PasswordResetDto } from '../dtos/reset.dto';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly usersService: UsersService,
    @Inject(registersEnv.KEY)
    private readonly configService: ConfigType<typeof registersEnv>,
  ) {}

  async sendPasswordResetEmail(email: string) {
    const { passwordResetTokenSecret, passwordResetTokenExpirationTime } =
      this.configService.jwt;
    const payload: RecoveryToken = { email };
    const passwordUrl = this.configService.passwordResetUrl;
    const token = this.jwtService.sign(payload, {
      secret: passwordResetTokenSecret,
      expiresIn: `${passwordResetTokenExpirationTime}s`,
    });
    const url = `${passwordUrl}?token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password recovery',
      template: './password-recovery',
      context: {
        name: email.split('@')[0],
        url,
        token,
      },
    });
  }

  async getEmailFromResetToken(token: string) {
    try {
      const { passwordResetTokenSecret } = this.configService.jwt;
      const decoded: RecoveryToken = this.jwtService.verify(token, {
        secret: passwordResetTokenSecret,
      });
      if (typeof decoded === 'object' && 'email' in decoded) {
        return decoded.email;
      }
      throw new BadRequestException('Invalid token payload');
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException('Reset token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new BadRequestException('Invalid reset token');
      } else {
        throw new BadRequestException('Unknown token error');
      }
    }
  }

  async passwordReset(passwordResetDto: PasswordResetDto) {
    const email = await this.getEmailFromResetToken(passwordResetDto.token);
    const user = await this.usersService.findUserByEmail(email);
    const hashPassword = await bcrypt.hash(passwordResetDto.password, 10);
    const isSamePassword = await bcrypt.compare(
      passwordResetDto.password,
      user.password,
    );
    if (isSamePassword)
      throw new BadRequestException(
        'Please choose a different password than the current one.',
      );
    await this.usersService.updatePassword(user.email, hashPassword);
  }
}
