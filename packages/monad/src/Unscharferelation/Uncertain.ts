import { Absent } from './Absent';
import { UnscharferelationError } from './Error/UnscharferelationError';
import { Heisenberg } from './Interface/Heisenberg';
import { Present } from './Present';

export class Uncertain<U> implements Heisenberg<U, 'Uncertain'> {
  public readonly noun: 'Uncertain' = 'Uncertain';

  private static readonly INSTANCE: Uncertain<unknown> = new Uncertain<unknown>();

  public static of<U>(): Uncertain<U> {
    return (Uncertain.INSTANCE as unknown) as Uncertain<U>;
  }

  private constructor() {
    // NOOP
  }

  public get(): never {
    throw new UnscharferelationError('UNCERTAIN');
  }

  public isPresent(): this is Present<U> {
    return false;
  }

  public isAbsent(): this is Absent<U> {
    return false;
  }

  public isUncertain(): this is Uncertain<U> {
    return true;
  }
}
