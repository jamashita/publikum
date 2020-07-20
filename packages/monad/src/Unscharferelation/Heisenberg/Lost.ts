import { Consumer } from '@jamashita/publikum-type';
import { Absent } from './Absent';
import { Heisenberg } from './Heisenberg';
import { Present } from './Present';

export class Lost<P> implements Heisenberg<P, 'Lost'> {
  public readonly noun: 'Lost' = 'Lost';
  private readonly cause: unknown;

  public static of<P>(cause: unknown): Lost<P> {
    return new Lost<P>(cause);
  }

  private constructor(cause: unknown) {
    this.cause = cause;
  }

  public get(): never {
    throw this.cause;
  }

  public isPresent(): this is Present<P> {
    return false;
  }

  public isAbsent(): this is Absent<P> {
    return false;
  }

  public isLost(): this is Lost<P> {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public ifPresent(_consumer: Consumer<P>): void {
    // NOOP
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public ifAbsent(_consumer: Consumer<void>): void {
    // NOOP
  }

  public ifLost(consumer: Consumer<unknown>): void {
    consumer(this.cause);
  }

  public getCause(): unknown {
    return this.cause;
  }
}
