import { UnscharferelationError } from '../Error/UnscharferelationError';
import { Heisenberg } from './Heisenberg';
import { Lost } from './Lost';
import { Present } from './Present';

export class Absent<P> implements Heisenberg<P, 'Absent'> {
  public readonly noun: 'Absent' = 'Absent';

  private static readonly INSTANCE: Absent<unknown> = new Absent<unknown>();

  public static of<P>(): Absent<P> {
    return (Absent.INSTANCE as unknown) as Absent<P>;
  }

  private constructor() {
    // NOOP
  }

  public get(): never {
    throw new UnscharferelationError('ABSENT');
  }

  public isPresent(): this is Present<P> {
    return false;
  }

  public isAbsent(): this is Absent<P> {
    return true;
  }

  public isLost(): this is Lost<P> {
    return false;
  }

  public isSettled(): boolean {
    return true;
  }
}
