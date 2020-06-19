import { Dead } from './Dead';
import { Schrodinger } from './Schrodinger';

export class Alive<S, F extends Error> implements Schrodinger<S, F, 'Alive'> {
  public readonly noun: 'Alive' = 'Alive';
  private readonly value: S;

  public static of<S, F extends Error>(value: S): Alive<S, F> {
    return new Alive<S, F>(value);
  }

  protected constructor(value: S) {
    this.value = value;
  }

  public get(): S {
    return this.value;
  }

  public isAlive(): this is Alive<S, F> {
    return true;
  }

  public isDead(): this is Dead<S, F> {
    return false;
  }

  public transpose<E extends Error>(): Alive<S, E> {
    return (this as unknown) as Alive<S, E>;
  }

  /*
   * TODO
   * public toQuantum(): Quantum<S> {
   *   return Present.of<S>(this.value);
   * }
   */
}
