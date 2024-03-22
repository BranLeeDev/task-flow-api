import { join } from 'path';
import { Module } from '@nestjs/common';
import { EmailConfirmationService } from './services/email-confirmation.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import registersEnv from '@env/registers.env';
import { ConfigType } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [registersEnv.KEY],
      useFactory: (configService: ConfigType<typeof registersEnv>) => {
        const { service, user, password } = configService.email;
        return {
          transport: {
            host: `smtp.${service}`,
            secure: true,
            port: 465,
            auth: {
              user,
              pass: password,
            },
          },
          defaults: {
            from: `"Task Flow" <${user}>`,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [EmailConfirmationService],
})
export class EmailsModule {}
