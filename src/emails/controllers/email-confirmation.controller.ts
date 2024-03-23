import { Body, Controller, Post } from '@nestjs/common';
import { EmailConfirmationService } from '../services/email-confirmation.service';
import { ConfirmEmailDto } from '../dtos/confirm.dto';

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
}
