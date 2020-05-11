import { BiFunction } from '../Type';
import { Dead } from './Dead';
import { Superposition } from './Superposition';

export class Alive<S, F extends Error> extends Superposition<S, F> {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dead:
      | BiFunction<F, Dead<S, F>, T>
      | BiFunction<F, Dead<S, F>, Promise<T>>
      | BiFunction<F, Dead<S, F>, Superposition<T, E>>
      | BiFunction<F, Dead<S, F>, Promise<Superposition<T, E>>>
  ): T | Promise<T> | Superposition<T, E> | Promise<Superposition<T, E>> {
    return alive(this.value, this);
  }

  public transpose<E extends Error>(): Alive<S, E> {
    return (this as never) as Alive<S, E>;
  }
}
