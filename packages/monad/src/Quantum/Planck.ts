import { Suspicious } from '@jamashita/publikum-type';

import { Absent } from './Absent';
import { Present } from './Present';
import { Quantum } from './Quantum';

export class Planck {
  public static maybe<T extends Quantum<unknown>>(value: Suspicious<T>): T;
  public static maybe<T>(value: Suspicious<T>): Quantum<T>;
  public static maybe<T>(value: Suspicious<T>): Quantum<T> | T {
    if (value === null) {
      return Absent.of<T>();
    }
    if (value === undefined) {
      return Absent.of<T>();
    }
    if (value instanceof Quantum) {
      return value;
    }

    return Present.of<T>(value);
  }

  private constructor() {
    // NOOP
  }
}
