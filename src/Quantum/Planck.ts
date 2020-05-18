import { Suspicious } from '../Type';
import { Absent } from './Absent';
import { Present } from './Present';
import { Quantum } from './Quantum';

export class Planck {
  public static maybe<T>(value: Suspicious<T>): Quantum<T> {
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