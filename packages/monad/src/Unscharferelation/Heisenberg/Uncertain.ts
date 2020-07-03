import { UnscharferelationError } from '../Error/UnscharferelationError';
import { Absent } from './Absent';
import { Heisenberg } from './Heisenberg';
import { Present } from './Present';

export class Uncertain<P> implements Heisenberg<P, 'Uncertain'> {
  public readonly noun: 'Uncertain' = 'Uncertain';

  private static readonly INSTANCE: Uncertain<unknown> = new Uncertain<unknown>();

  public static of<P>(): Uncertain<P> {
    return (Uncertain.INSTANCE as unknown) as Uncertain<P>;
  }

  private constructor() {
    // NOOP
  }

  public get(): never {
    throw new UnscharferelationError('UNCERTAIN');
  }

  public isPresent(): this is Present<P> {
    return false;
  }

  public isAbsent(): this is Absent<P> {
    return false;
  }

  public isSettled(): boolean {
    return false;
  }
}
