import { BiFunction } from '@jamashita/publikum-type';

import { Quantum } from '../Quantum/Quantum';
import { Alive } from './Alive';
import { Dead } from './Dead';

export abstract class Superposition<S, F extends Error> {
  public abstract readonly noun: 'Alive' | 'Dead';

  protected constructor() {
    // NOOP
  }

  public abstract get(): S;

  public abstract match<T>(alive: BiFunction<S, Alive<S, F>, T>, dead: BiFunction<F, Dead<S, F>, T>): T;
  public abstract match<T>(
    alive: BiFunction<S, Alive<S, F>, Promise<T>>,
    dead: BiFunction<F, Dead<S, F>, Promise<T>>
  ): Promise<T>;
  public abstract match<T, E extends Error>(
    alive: BiFunction<S, Alive<S, F>, Superposition<T, E>>,
    dead: BiFunction<F, Dead<S, F>, Superposition<T, E>>
  ): Superposition<T, E>;
  public abstract match<T, E extends Error>(
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
