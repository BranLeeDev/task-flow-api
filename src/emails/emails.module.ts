import { join } from 'path';
import { Module } from '@nestjs/common';
import { EmailConfirmationService } from './services/email-confirmation.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import registersEnv from '@env/registers.env';
import { ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { EmailConfirmationController } from './controllers/email-confirmation.controller';
import { PasswordResetService } from './services/password-reset.service';
import { PasswordResetController } from './controllers/password-reset.controller';
import { TeamInvitationService } from './services/team-invitation.service';
import { TasksStatusService } from './services/tasks-status.service';
import { TasksModule } from 'src/tasks/tasks.module';

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
    JwtModule,
    UsersModule,
    TasksModule,
  ],
  providers: [
    EmailConfirmationService,
    PasswordResetService,
    TeamInvitationService,
    TasksStatusService,
  ],
  exports: [EmailConfirmationService],
  controllers: [EmailConfirmationController, PasswordResetController],
})
export class EmailsModule {}
