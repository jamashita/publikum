import { Kind } from '@jamashita/publikum-type';

import { ISuperposition } from './Interface/ISuperposition';

export class BeSuperposition {
  public static is<A, D extends Error>(value: unknown): value is ISuperposition<A, D> {
    if (!Kind.isObject<ISuperposition<A, D>>(value)) {
      return false;
    }
    if (typeof value.get !== 'function') {
      return false;
    }
    if (typeof value.terminate !== 'function') {
      return false;
    }
    if (typeof value.filter !== 'function') {
      return false;
    }
    if (typeof value.map !== 'function') {
      return false;
    }
    if (typeof value.recover !== 'function') {
      return false;
    }
    if (typeof value.transform !== 'function') {
      return false;
    }
    if (typeof value.pass !== 'function') {
      return false;
    }
    if (typeof value.toUnscharferelation !== 'function') {
      return false;
    }

    return true;
  }

  private constructor() {
    // NOOP
  }
}
