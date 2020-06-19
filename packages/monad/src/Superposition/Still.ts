import { Predicate, UnaryFunction } from '@jamashita/publikum-type';

import { Alive } from './Alive';
import { Dead } from './Dead';
import { SuperpositionError } from './Error/SuperpositionError';
import { Schrodinger } from './Schrodinger';

export class Still<S, F extends Error> implements Schrodinger<S, F, 'Still'> {
  public readonly noun: 'Still' = 'Still';

  private static readonly INSTANCE: Still<unknown, SuperpositionError> = new Still<unknown, SuperpositionError>();

  public static of<S, F extends Error>(): Still<S, F> {
    return Still.INSTANCE.transpose<S, F>();
  }

  protected constructor() {
    // NOOP
  }

  public get(): never {
    throw new SuperpositionError('STILL');
  }

  public isAlive(): this is Alive<S, F> {
    return false;
  }

  public isDead(): this is Dead<S, F> {
    return false;
  }

  public filter(predicate: Predicate<S>): never;
  public filter(): never {
    throw new SuperpositionError('STILL');
  }

  public map<T, E extends Error>(mapper: UnaryFunction<S, Schrodinger<T, E>>): never;
  public map<T, E extends Error = F>(mapper: UnaryFunction<S, T>): never;
  public map<T, E extends Error = F>(mapper: UnaryFunction<S, Promise<T>>): never;
  public map<T, E extends Error = F>(): never {
    throw new SuperpositionError('STILL');
  }

  public recover<T, E extends Error>(mapper: UnaryFunction<F, Schrodinger<T, E>>): never;
  public recover<T, E extends Error = F>(mapper: UnaryFunction<F, T>): never;
  public recover<T, E extends Error = F>(mapper: UnaryFunction<F, Promise<T>>): never;
  public recover<T, E extends Error = F>(): never {
    throw new SuperpositionError('STILL');
  }

  public transpose<T, E extends Error>(): Still<T, E> {
    return (this as unknown) as Still<T, E>;
  }

  /*
   * public toQuantum(): Quantum<S> {
   *   return Absent.of<S>();
   * }
   */
}
