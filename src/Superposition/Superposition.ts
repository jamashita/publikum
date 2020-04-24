import { BiFunction } from '../Type';
import { Alive } from './Alive';
import { Failure } from './Failure';

export abstract class Superposition<S, F extends Error> {
  public abstract readonly noun: 'Alive' | 'Dead';

  protected constructor() {
  }

  public abstract get(): S;

  public abstract match<T>(alive: BiFunction<S, Alive<S, F>, T>, failure: BiFunction<F, Failure<S, F>, T>): T;
  public abstract match<T>(alive: BiFunction<S, Alive<S, F>, Promise<T>>, failure: BiFunction<F, Failure<S, F>, Promise<T>>): Promise<T>;
  public abstract match<T, E extends Error>(alive: BiFunction<S, Alive<S, F>, Superposition<T, E>>, failure: BiFunction<F, Failure<S, F>, Superposition<T, E>>): Superposition<T, E>;
  public abstract match<T, E extends Error>(alive: BiFunction<S, Alive<S, F>, Promise<Superposition<T, E>>>, failure: BiFunction<F, Failure<S, F>, Promise<Superposition<T, E>>>): Promise<Superposition<T, E>>;

  public isAlive(): this is Alive<S, F> {
    return false;
  }

  public isFailure(): this is Failure<S, F> {
    return false;
  }
}
