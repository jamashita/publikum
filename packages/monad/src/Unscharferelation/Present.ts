import { Etre } from '../Interface/Etre';
import { Absent } from './Absent';
import { Heisenberg } from './Interface/Heisenberg';

export class Present<P> implements Heisenberg<P, 'Present'> {
  public readonly noun: 'Present' = 'Present';
  private readonly value: Etre<P>;

  public static of<P>(value: Etre<P>): Present<P> {
    return new Present<P>(value);
  }

  private constructor(value: Etre<P>) {
    this.value = value;
  }

  public get(): Etre<P> {
    return this.value;
  }

  public isPresent(): this is Present<P> {
    return true;
  }

  public isAbsent(): this is Absent<P> {
    return false;
  }
}
