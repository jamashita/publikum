import { Kind } from '@jamashita/publikum-type';

import { IUnscharferelation } from './Interface/IUnscharferelation';

export class BeUnscharferelation {
  public static is<P>(value: unknown): value is IUnscharferelation<P> {
    if (!Kind.isObject<IUnscharferelation<P>>(value)) {
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
    if (typeof value.toSuperposition !== 'function') {
      return false;
    }

    return true;
  }

  private constructor() {
    // NOOP
  }
}
