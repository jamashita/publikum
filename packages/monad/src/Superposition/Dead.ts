import { Predicate } from '@jamashita/publikum-type';

import { Alive } from './Alive';
import { SuperpositionError } from './Error/SuperpositionError';
import { Schrodinger } from './Schrodinger';

export class Dead<S, F extends Error> implements Schrodinger<S, F, 'Dead'> {
  public readonly noun: 'Dead' = 'Dead';
  private readonly error: F;

  public static of<S, F extends Error>(error: F): Dead<S, F> {
    return new Dead<S, F>(error);
  }

  protected constructor(error: F) {
    this.error = error;
  }

  public get(): never {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw this.error;
  }

  public getError(): F {
    return this.error;
  }

  public isAlive(): this is Alive<S, F> {
    return false;
  }

  public isDead(): this is Dead<S, F> {
    return true;
  }

  public filter(predicate: Predicate<S>): Dead<S, F | SuperpositionError>;
  public filter(): Dead<S, F | SuperpositionError> {
    return this;
  }

  public transpose<T>(): Dead<T, F> {
    return (this as unknown) as Dead<T, F>;
  }

  /*
   * TODO
   * public toQuantum(): Quantum<S> {
   *   return Absent.of<S>();
   * }
   */
}
