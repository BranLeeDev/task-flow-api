import {
  AbilityBuilder,
  ExtractSubjectType,
  MongoAbility,
  createMongoAbility,
} from '@casl/ability';
import { Project, Task, Team, User } from '@entities/index';
import { UserRoles } from '@models/user.model';
import { Injectable } from '@nestjs/common';

export enum Actions {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}
type Subjects =
  | User
  | typeof User
  | Team
  | typeof Team
  | Task
  | typeof Task
  | Project
  | typeof Project
  | 'all';
type AppAbility = MongoAbility<[Actions, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  defineAbilityFor(user: User) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    if (user.role === UserRoles.Administrator) {
      can(Actions.Manage, 'all');
    }

    if (user.role === UserRoles.leader) {
      can(
        [Actions.Create, Actions.Update, Actions.Read, Actions.Delete],
        Team,
        {
          leader: {
            id: user.id,
          },
        },
      );
    }

    can(
      [Actions.Create, Actions.Update, Actions.Read, Actions.Delete],
      Project,
      {
        user: {
          id: user.id,
        },
      },
    );

    can([Actions.Create, Actions.Update, Actions.Read, Actions.Delete], Task, {
      user: {
        id: user.id,
      },
    });

    can([Actions.Update, Actions.Read, Actions.Delete], User, {
      id: user.id,
    });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
