import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TasksService } from 'src/tasks/services/tasks.service';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class TasksStatusService {
  constructor(
    private readonly tasksService: TasksService,
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async sendTasksStatus() {
    const usersList = await this.usersService.findAll();

    for (const user of usersList) {
      const pendingTasks = await this.tasksService.countPendingTasks(user.id);
      const inProgressTask = await this.tasksService.countInProgressTasks(
        user.id,
      );

      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Status of your tasks',
        template: './tasks-status',
        context: {
          name: user.email.split('@')[0],
          pendingTasks,
          inProgressTask,
        },
      });
    }
  }
}
