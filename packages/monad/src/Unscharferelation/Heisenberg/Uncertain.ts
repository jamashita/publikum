import { Consumer } from '@jamashita/publikum-type';
import { UnscharferelationError } from '../Error/UnscharferelationError';
import { Absent } from './Absent';
import { Heisenberg } from './Heisenberg';
import { Lost } from './Lost';
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

  public isLost(): this is Lost<P> {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public ifPresent(_consumer: Consumer<P>): void {
    // NOOP
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public ifAbsent(_consumer: Consumer<void>): void {
    // NOOP
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public ifLost(_consumer: Consumer<unknown>): void {
    // NOOP
  }

  public equals(other: Heisenberg<P>): boolean {
    if (this === other) {
      return true;
    }

    return false;
  }
}
