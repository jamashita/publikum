import { Kind } from '@jamashita/publikum-type';

import { DeadConstructor } from './Interface/DeadConstructor';

export class DeadErrorDetective {
  public static contains<E extends Error>(err: unknown, errors: Array<DeadConstructor<E>>): err is E {
    return errors.some((error: DeadConstructor<E>) => {
      return Kind.isClass(err, error);
    });
  }

  private constructor() {
    // NOOP
  }
}
