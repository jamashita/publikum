import { BinaryFunction, Predicate, UnaryFunction } from '@jamashita/publikum-type';

import { Present } from '../Quantum/Present';
import { Quantum } from '../Quantum/Quantum';
import { Dead } from './Dead';
import { SuperpositionError } from './Error/SuperpositionError';
import { Schrodinger } from './Schrodinger';
import { Superposition } from './Superposition';

export class Alive<S, F extends Error> extends Superposition<S, F, 'Alive'> {
  public readonly noun: 'Alive' = 'Alive';
  private readonly value: S;

  public static of<F extends Error>(): Alive<void, F>;
  public static of<S, F extends Error>(value: S): Alive<S, F>;
  public static of<S, F extends Error>(value?: S): Alive<void, F> | Alive<S, F> {
    if (value === undefined) {
      return new Alive<void, F>(undefined);
    }

    return new Alive<S, F>(value);
  }

  private constructor(value: S) {
    super();
    this.value = value;
  }

  public get(): S {
    return this.value;
  }

  public isAlive(): this is Alive<S, F> {
    return true;
  }

  public filter(predicate: Predicate<S>): Superposition<S, F | SuperpositionError> {
    if (predicate(this.value)) {
      return this;
    }

    return Dead.of<S, SuperpositionError>(new SuperpositionError('IS DEAD'));
  }

  public map<T, E extends Error>(mapper: UnaryFunction<S, Superposition<T, E>>): Superposition<T, F | E>;
  public map<T, E extends Error = F>(mapper: UnaryFunction<S, T>): Superposition<T, F | E>;
  public map<T, E extends Error = F>(mapper: UnaryFunction<S, Superposition<T, E> | T>): Superposition<T, F | E> {
    return Schrodinger.playground<T, E>(() => {
      return mapper(this.value);
    });
  }

  public recover<T, E extends Error>(mapper: UnaryFunction<F, Superposition<T, E>>): Superposition<S | T, E>;
  public recover<T, E extends Error = F>(mapper: UnaryFunction<F, T>): Superposition<S | T, E>;
  public recover<T, E extends Error = F>(): Superposition<S | T, E> {
    return this.transpose<E>();
  }

  public transform<T>(alive: BinaryFunction<S, Alive<S, F>, T>, dead: BinaryFunction<F, Dead<S, F>, T>): T;
  public transform<T>(
    alive: BinaryFunction<S, Alive<S, F>, Promise<T>>,
    dead: BinaryFunction<F, Dead<S, F>, Promise<T>>
  ): Promise<T>;
  public transform<T, E extends Error>(
    alive: BinaryFunction<S, Alive<S, F>, Superposition<T, E>>,
    dead: BinaryFunction<F, Dead<S, F>, Superposition<T, E>>
  ): Superposition<T, E>;
  public transform<T, E extends Error>(
    alive: BinaryFunction<S, Alive<S, F>, Promise<Superposition<T, E>>>,
    dead: BinaryFunction<F, Dead<S, F>, Promise<Superposition<T, E>>>
  ): Promise<Superposition<T, E>>;
  public transform<T, E extends Error = F>(
    alive:
      | BinaryFunction<S, Alive<S, F>, T>
      | BinaryFunction<S, Alive<S, F>, Promise<T>>
      | BinaryFunction<S, Alive<S, F>, Superposition<T, E>>
      | BinaryFunction<S, Alive<S, F>, Promise<Superposition<T, E>>>
  ): T | Promise<T> | Superposition<T, E> | Promise<Superposition<T, E>> {
    return alive(this.value, this);
  }

  public transpose<E extends Error>(): Alive<S, E> {
    return (this as never) as Alive<S, E>;
  }

  public toQuantum(): Quantum<S> {
    return Present.of<S>(this.value);
  }
}
