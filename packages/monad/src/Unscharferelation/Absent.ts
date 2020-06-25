import { UnscharferelationError } from './Error/UnscharferelationError';
import { Heisenberg } from './Interface/Heisenberg';
import { Present } from './Present';
import { Uncertain } from './Uncertain';

export class Absent<A> implements Heisenberg<A, 'Absent'> {
  public readonly noun: 'Absent' = 'Absent';

  private static readonly INSTANCE: Absent<unknown> = new Absent<unknown>();

  public static of<A>(): Absent<A> {
    return (Absent.INSTANCE as unknown) as Absent<A>;
  }

  private constructor() {
    // NOOP
  }

  public get(): never {
    throw new UnscharferelationError('ABSENT');
  }

  public isPresent(): this is Present<A> {
    return false;
  }

  public isAbsent(): this is Absent<A> {
    return true;
  }

  public isUncertain(): this is Uncertain<A> {
    return false;
  }
}
