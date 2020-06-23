import { Present } from '@jamashita/publikum-monad';

import { Absent } from './Absent';
import { QuantizationError } from './Error/QuantizationError';
import { Heisenberg } from './Interface/Heisenberg';

export class Uncertain<T> implements Heisenberg<T, 'Uncertain'> {
  public readonly noun: 'Uncertain' = 'Uncertain';

  private static readonly INSTANCE: Uncertain<unknown> = new Uncertain<unknown>();

  public static of<T>(): Uncertain<T> {
    return (Uncertain.INSTANCE as unknown) as Uncertain<T>;
  }

  private constructor() {
    // NOOP
  }

  public get(): never {
    throw new QuantizationError('UNCERTAIN');
  }

  public isPresent(): this is Present<T> {
    return false;
  }

  public isAbsent(): this is Absent<T> {
    return false;
  }

  public isUncertain(): this is Uncertain<T> {
    return true;
  }
}
