import { Detoxicated } from '@jamashita/publikum-type';

import { Dead } from './Dead';
import { Schrodinger } from './Interface/Schrodinger';

export class Alive<A, D extends Error> implements Schrodinger<A, D, 'Alive'> {
  public readonly noun: 'Alive' = 'Alive';
  private readonly value: Detoxicated<A>;

  public static of<A, D extends Error>(value: Detoxicated<A>): Alive<A, D> {
    return new Alive<A, D>(value);
  }

  protected constructor(value: Detoxicated<A>) {
    this.value = value;
  }

  public get(): Detoxicated<A> {
    return this.value;
  }

  public isAlive(): this is Alive<A, D> {
    return true;
  }

  public isDead(): this is Dead<A, D> {
    return false;
  }
}
