import { Body, Controller, Post, Req } from '@nestjs/common';
import { EmailConfirmationService } from '../services/email-confirmation.service';
import { ConfirmEmailDto } from '../dtos/confirm.dto';
import { FastifyRequest } from 'src/auth/models/request.model';

@Controller('email-confirmation')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationEmail: EmailConfirmationService,
  ) {}

  @Post('confirm')
  async confirm(@Body() confirmEmailDto: ConfirmEmailDto) {
    const email = await this.emailConfirmationEmail.decodeConfirmationToken(
      confirmEmailDto.token,
    );
    await this.emailConfirmationEmail.confirmEmail(email);
    return {
      message: 'Email address has been successfully confirmed',
    };
  }

  @Post('resend-confirmation-link')
  async resendConfirmationLink(@Req() request: FastifyRequest) {
    await this.emailConfirmationEmail.resendConfirmationLink(request.user.id);
    return {
      message: 'Confirmation link has been successfully resent',
    };
  }
}
