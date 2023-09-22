import { SetMetadata } from '@nestjs/common';
import {
  Action,
  Subjects,
} from '../../casl/casl-ability.factory/casl-ability.factory';

export const CHECK_ABILITY = 'check_ability';
export interface RequiredRule {
  action: Action;
  subject: Subjects;
}
export const CheckAbility = (...requirements: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY, requirements);
