import { Present } from '@jamashita/publikum-monad';

import { QuantizationError } from './Error/QuantizationError';
import { Heisenberg } from './Interface/Heisenberg';

// TODO TEST UNDONE
export class Absent<T> implements Heisenberg<T, 'Absent'> {
  public readonly noun: 'Absent' = 'Absent';

  private static readonly INSTANCE: Absent<unknown> = new Absent<unknown>();

  public static of<T>(): Absent<T> {
    return (Absent.INSTANCE as unknown) as Absent<T>;
  }

  private constructor() {
    // NOOP
  }

  public get(): never {
    throw new QuantizationError('IS NOT PRESENT');
  }
  public isPresent(): this is Present<T> {
    return false;
  }

  public isAbsent(): this is Absent<T> {
    return true;
  }

  public isUncertain(): boolean {
    return false;
  }
}
