import { ValueObject } from '@jamashita/publikum-object';
import { Consumer } from '@jamashita/publikum-type';
import { UnscharferelationError } from '../Error/UnscharferelationError';
import { Heisenberg } from './Heisenberg';
import { Lost } from './Lost';
import { Present } from './Present';

export class Absent<P> extends ValueObject<'Absent'> implements Heisenberg<P, 'Absent'> {
  public readonly noun: 'Absent' = 'Absent';
  private static readonly INSTANCE: Absent<unknown> = new Absent<unknown>();

  public static of<PT>(): Absent<PT> {
    return (Absent.INSTANCE as unknown) as Absent<PT>;
  }

  private constructor() {
    super();
  }

  public serialize(): string {
    return 'Absent';
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

  public ifPresent(): void {
    // NOOP
  }

  public ifAbsent(consumer: Consumer<void>): void {
    consumer();
  }

  public ifLost(): void {
    // NOOP
  }

  public equals(other: ValueObject): boolean {
    if (this === other) {
      return true;
    }
    if (other instanceof Absent) {
      return true;
    }

    return false;
  }
}
