import { IUnscharferelation } from './Interface/IUnscharferelation';
import { Unscharferelation } from './Unscharferelation';
import { UnscharferelationInternal } from './UnscharferelationInternal';

// TODO TEST UNDONE
export class BeUnscharferelation {
  public static is<P>(value: unknown): value is IUnscharferelation<P> {
    if (value instanceof Unscharferelation) {
      return true;
    }
    if (value instanceof UnscharferelationInternal) {
      return true;
    }

    return false;
  }

  private constructor() {
    // NOOP
  }
}
