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

  public isSettled(): boolean {
    return true;
  }
}
