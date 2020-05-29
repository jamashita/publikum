import { BiFunction } from '@jamashita/publikum-type';

import { Absent } from '../Quantum/Absent';
import { Quantum } from '../Quantum/Quantum';
import { Alive } from './Alive';
import { Superposition } from './Superposition';

export class Dead<S, F extends Error> extends Superposition<S, F> {
  public readonly noun: 'Dead' = 'Dead';
  private readonly value: F;

  public static of<F extends Error>(value: F): Dead<void, F>;
  public static of<S, F extends Error>(value: F): Dead<S, F>;
  public static of<S, F extends Error>(value: F): Dead<void, F> | Dead<S, F> {
    return new Dead<S, F>(value);
  }

  private constructor(value: F) {
    super();
    this.value = value;
  }

  public get(): never {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw this.value as Error;
  }

  public getError(): F {
    return this.value;
  }

  public isDead(): this is Dead<S, F> {
    return true;
  }

  public match<T>(alive: BiFunction<S, Alive<S, F>, T>, dead: BiFunction<F, Dead<S, F>, T>): T;
  public match<T>(
    alive: BiFunction<S, Alive<S, F>, Promise<T>>,
    dead: BiFunction<F, Dead<S, F>, Promise<T>>
  ): Promise<T>;
  public match<T, E extends Error>(
    alive: BiFunction<S, Alive<S, F>, Superposition<T, E>>,
    dead: BiFunction<F, Dead<S, F>, Superposition<T, E>>
  ): Superposition<T, E>;
  public match<T, E extends Error>(
    alive: BiFunction<S, Alive<S, F>, Promise<Superposition<T, E>>>,
    dead: BiFunction<F, Dead<S, F>, Promise<Superposition<T, E>>>
  ): Promise<Superposition<T, E>>;
  public match<T, E extends Error = F>(
    alive:
      | BiFunction<S, Alive<S, F>, T>
      | BiFunction<S, Alive<S, F>, Promise<T>>
      | BiFunction<S, Alive<S, F>, Superposition<T, E>>
      | BiFunction<S, Alive<S, F>, Promise<Superposition<T, E>>>,
    dead:
      | BiFunction<F, Dead<S, F>, T>
      | BiFunction<F, Dead<S, F>, Promise<T>>
      | BiFunction<F, Dead<S, F>, Superposition<T, E>>
      | BiFunction<F, Dead<S, F>, Promise<Superposition<T, E>>>
  ): T | Promise<T> | Superposition<T, E> | Promise<Superposition<T, E>> {
    return dead(this.value, this);
  }

  public toQuantum(): Quantum<S> {
    return Absent.of<S>();
  }

  public transpose<T>(): Dead<T, F> {
    return (this as never) as Dead<T, F>;
  }
}
