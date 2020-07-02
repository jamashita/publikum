import { ISuperposition } from './Interface/ISuperposition';
import { Superposition } from './Superposition';
import { SuperpositionInternal } from './SuperpositionInternal';

// TODO TEST UNDONE
export class BeSuperposition {
  public static is<A, D extends Error>(value: unknown): value is ISuperposition<A, D> {
    if (value instanceof Superposition) {
      return true;
    }
    if (value instanceof SuperpositionInternal) {
      return true;
    }

    return false;
  }

  private constructor() {
    // NOOP
  }
}
