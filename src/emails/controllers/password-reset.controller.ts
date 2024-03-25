import { Body, Controller, Post, Req } from '@nestjs/common';
import { PasswordResetService } from '../services/password-reset.service';
import { FastifyRequest } from 'src/auth/models/request.model';
import { PasswordResetDto } from '../dtos/reset.dto';

@Controller('password-reset')
export class PasswordResetController {
  constructor(private readonly passwordReset: PasswordResetService) {}

  @Post('send-email')
  async requestReset(@Req() request: FastifyRequest) {
    await this.passwordReset.sendPasswordResetEmail(request.user.email);
    return {
      message: 'Password reset email sent successfully',
    };
  }

  @Post('update')
  async update(@Body() passwordResetDto: PasswordResetDto) {
    await this.passwordReset.passwordReset(passwordResetDto);
    return {
      message: 'Password updated successfully',
    };
  }
}
