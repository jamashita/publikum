import { ValueObject } from '@jamashita/publikum-object';
import { Consumer, Kind } from '@jamashita/publikum-type';
import { Absent } from './Absent';
import { Heisenberg } from './Heisenberg';
import { Present } from './Present';

export class Lost<P> extends ValueObject<Lost<P>, 'Lost'> implements Heisenberg<P, 'Lost'> {
  public readonly noun: 'Lost' = 'Lost';
  private readonly cause: unknown;

  public static of<PT>(cause: unknown): Lost<PT> {
    return new Lost<PT>(cause);
  }

  private constructor(cause: unknown) {
    super();
    this.cause = cause;
  }

  public serialize(): string {
    return `Lost: ${Kind.notate(this.cause)}`;
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

  public ifPresent(): void {
    // NOOP
  }

  public ifAbsent(): void {
    // NOOP
  }

  public ifLost(consumer: Consumer<unknown>): void {
    consumer(this.cause);
  }

  public equals(other: Heisenberg<P>): boolean {
    if (this === other) {
      return true;
    }

    return other.isLost();
  }

  public getCause(): unknown {
    return this.cause;
  }
}
