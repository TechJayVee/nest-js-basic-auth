import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Role, User } from '../entity';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects = InferSubjects<typeof Role | typeof User> | 'all';

@Injectable()
export class CaslAbilityFactory {
  defineAbility(user: User) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    if (user.role.includes('ADMIN')) {
      can(Action.Create, Role);
    } else {
      can(Action.Read, 'all');
      cannot(Action.Create, Role).because('You are not an Admin');
      cannot(Action.Delete, Role).because('You are not an Admin');
    }

    // can(Action.Update, Role, { authorId: user.id });
    // cannot(Action.Delete, Role, { isPublished: true });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
