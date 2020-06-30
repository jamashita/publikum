import { Absent } from './Absent';
import { Heisenberg } from './Interface/Heisenberg';
import { Present } from './Present';

export class Lost<P> implements Heisenberg<P, 'Lost'> {
  public readonly noun: 'Lost' = 'Lost';
  private readonly error: unknown;

  public static of<P>(error: unknown): Lost<P> {
    return new Lost<P>(error);
  }

  private constructor(error: unknown) {
    this.error = error;
  }

  public get(): never {
    throw this.error;
  }

  public isPresent(): this is Present<P> {
    return false;
  }

  public isAbsent(): this is Absent<P> {
    return false;
  }
}
