import { BiFunction, MonoFunction, Predicate } from '@jamashita/publikum-type';

import { Quantum } from '../Quantum/Quantum';
import { Alive } from './Alive';
import { Dead } from './Dead';
import { SuperpositionError } from './Error/SuperpositionError';

export abstract class Superposition<S, F extends Error> {
  public abstract readonly noun: 'Alive' | 'Dead';

  protected constructor() {
    // NOOP
  }

  public abstract get(): S;

  public abstract filter(predicate: Predicate<S>): Superposition<S, F | SuperpositionError>;

  public abstract map<U>(mapper: MonoFunction<S, U>): Superposition<U, F>;

  public abstract transform<T>(alive: BiFunction<S, Alive<S, F>, T>, dead: BiFunction<F, Dead<S, F>, T>): T;
  public abstract transform<T>(
    alive: BiFunction<S, Alive<S, F>, Promise<T>>,
    dead: BiFunction<F, Dead<S, F>, Promise<T>>
  ): Promise<T>;
  public abstract transform<T, E extends Error>(
    alive: BiFunction<S, Alive<S, F>, Superposition<T, E>>,
    dead: BiFunction<F, Dead<S, F>, Superposition<T, E>>
  ): Superposition<T, E>;
  public abstract transform<T, E extends Error>(
    alive: BiFunction<S, Alive<S, F>, Promise<Superposition<T, E>>>,
    dead: BiFunction<F, Dead<S, F>, Promise<Superposition<T, E>>>
  ): Promise<Superposition<T, E>>;

  public abstract toQuantum(): Quantum<S>;

  public isAlive(): this is Alive<S, F> {
    return false;
  }

  public isDead(): this is Dead<S, F> {
    return false;
  }
}
