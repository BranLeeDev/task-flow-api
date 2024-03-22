import { Module } from '@nestjs/common';
import { EmailConfirmationService } from './services/email-confirmation.service';

@Module({
  providers: [EmailConfirmationService],
})
export class EmailsModule {}
