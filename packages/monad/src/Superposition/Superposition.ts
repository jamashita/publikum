import { BinaryFunction, Predicate, UnaryFunction } from '@jamashita/publikum-type';

import { Noun } from '../../../interface/src/Noun';
import { Quantum } from '../Quantum/Quantum';
import { Alive } from './Alive';
import { Dead } from './Dead';
import { SuperpositionError } from './Error/SuperpositionError';

type SuperpositionType = 'Alive' | 'Dead';

export abstract class Superposition<S, F extends Error, N extends SuperpositionType = SuperpositionType>
  implements Noun<N> {
  public abstract readonly noun: N;

  protected constructor() {
    // NOOP
  }

  public abstract get(): S;

  public abstract filter(predicate: Predicate<S>): Superposition<S, F | SuperpositionError>;

  public abstract map<T, E extends Error>(mapper: UnaryFunction<S, Superposition<T, E>>): Superposition<T, F | E>;
  public abstract map<T, E extends Error = F>(mapper: UnaryFunction<S, T>): Superposition<T, F | E>;

  public abstract recover<T, E extends Error>(mapper: UnaryFunction<F, Superposition<T, E>>): Superposition<S | T, E>;
  public abstract recover<T, E extends Error = F>(mapper: UnaryFunction<F, T>): Superposition<S | T, E>;

  public abstract transform<T>(alive: BinaryFunction<S, Alive<S, F>, T>, dead: BinaryFunction<F, Dead<S, F>, T>): T;
  public abstract transform<T>(
    alive: BinaryFunction<S, Alive<S, F>, Promise<T>>,
    dead: BinaryFunction<F, Dead<S, F>, Promise<T>>
  ): Promise<T>;
  public abstract transform<T, E extends Error>(
    alive: BinaryFunction<S, Alive<S, F>, Superposition<T, E>>,
    dead: BinaryFunction<F, Dead<S, F>, Superposition<T, E>>
  ): Superposition<T, E>;
  public abstract transform<T, E extends Error>(
    alive: BinaryFunction<S, Alive<S, F>, Promise<Superposition<T, E>>>,
    dead: BinaryFunction<F, Dead<S, F>, Promise<Superposition<T, E>>>
  ): Promise<Superposition<T, E>>;

  public abstract toQuantum(): Quantum<S>;

  public isAlive(): this is Alive<S, F> {
    return false;
  }

  public isDead(): this is Dead<S, F> {
    return false;
  }
}
