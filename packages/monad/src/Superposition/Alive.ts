import { Dead } from './Dead';
import { Schrodinger } from './Interface/Schrodinger';
import { Still } from './Still';

export class Alive<A, D extends Error> implements Schrodinger<A, D, 'Alive'> {
  public readonly noun: 'Alive' = 'Alive';
  private readonly value: A;

  public static of<A, D extends Error>(value: A): Alive<A, D> {
    return new Alive<A, D>(value);
  }

  protected constructor(value: A) {
    this.value = value;
  }

  public get(): A {
    return this.value;
  }

  public isAlive(): this is Alive<A, D> {
    return true;
  }

  public isDead(): this is Dead<A, D> {
    return false;
  }

  public isStill(): this is Still<A, D> {
    return false;
  }
}
