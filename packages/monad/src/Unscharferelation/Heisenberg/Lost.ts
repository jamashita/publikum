import { Absent } from './Absent';
import { Heisenberg } from './Heisenberg';
import { Present } from './Present';

export class Lost<P> implements Heisenberg<P, 'Lost'> {
  public readonly noun: 'Lost' = 'Lost';
  private readonly thrown: unknown;

  public static of<P>(thrown: unknown): Lost<P> {
    return new Lost<P>(thrown);
  }

  private constructor(thrown: unknown) {
    this.thrown = thrown;
  }

  public get(): never {
    throw this.thrown;
  }

  public isPresent(): this is Present<P> {
    return false;
  }

  public isAbsent(): this is Absent<P> {
    return false;
  }

  public isSettled(): boolean {
    return true;
  }
}
