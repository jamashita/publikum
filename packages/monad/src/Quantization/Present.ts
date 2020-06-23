import { Absent } from './Absent';
import { Heisenberg } from './Interface/Heisenberg';
import { Uncertain } from './Uncertain';

export class Present<T> implements Heisenberg<T, 'Present'> {
  public readonly noun: 'Present' = 'Present';
  private readonly value: T;

  public static of<T>(value: T): Present<T> {
    return new Present<T>(value);
  }

  private constructor(value: T) {
    this.value = value;
  }

  public get(): T {
    return this.value;
  }

  public isPresent(): this is Present<T> {
    return true;
  }

  public isAbsent(): this is Absent<T> {
    return false;
  }

  public isUncertain(): this is Uncertain<T> {
    return false;
  }
}
