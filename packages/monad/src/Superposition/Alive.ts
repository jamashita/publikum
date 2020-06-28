import { Dead } from './Dead';
import { Schrodinger } from './Interface/Schrodinger';

export class Alive<A, D extends Error> implements Schrodinger<A, D, 'Alive'> {
  public readonly noun: 'Alive' = 'Alive';
  private readonly value: Exclude<A, Error>;

  public static of<A, D extends Error>(value: Exclude<A, Error>): Alive<A, D> {
    return new Alive<A, D>(value);
  }

  protected constructor(value: Exclude<A, Error>) {
    this.value = value;
  }

  public get(): Exclude<A, Error> {
    return this.value;
  }

  public isAlive(): this is Alive<A, D> {
    return true;
  }

  public isDead(): this is Dead<A, D> {
    return false;
  }
}
