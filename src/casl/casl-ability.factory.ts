import {
  AbilityBuilder,
  ExtractSubjectType,
  MongoAbility,
  createMongoAbility,
} from '@casl/ability';
import { User } from '@entities/index';
import { Injectable } from '@nestjs/common';

export enum Actions {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}
type Subjects = User | typeof User;
type AppAbility = MongoAbility<[Actions, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  defineAbilityFor(user: User) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    can([Actions.Update, Actions.Read, Actions.Delete], User, {
      id: user.id,
    });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
