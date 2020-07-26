import { isEqualable } from '@jamashita/publikum-interface';
import { Consumer } from '@jamashita/publikum-type';
import { Matter } from '../Interface/Matter';
import { Absent } from './Absent';
import { Heisenberg } from './Heisenberg';
import { Lost } from './Lost';

export class Present<P> implements Heisenberg<P, 'Present'> {
  public readonly noun: 'Present' = 'Present';
  private readonly value: Matter<P>;

  public static of<P>(value: Matter<P>): Present<P> {
    return new Present<P>(value);
  }

  private constructor(value: Matter<P>) {
    this.value = value;
  }

  public get(): Matter<P> {
    return this.value;
  }

  public isPresent(): this is Present<P> {
    return true;
  }

  public isAbsent(): this is Absent<P> {
    return false;
  }

  public isLost(): this is Lost<P> {
    return false;
  }

  public ifPresent(consumer: Consumer<P>): void {
    consumer(this.value);
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
    if (!other.isPresent()) {
      return false;
    }
    if (this.value === other.value) {
      return true;
    }
    if (isEqualable(this.value)) {
      if (isEqualable(other.value)) {
        return this.value.equals(other.value);
      }
    }

    return false;
  }
}
