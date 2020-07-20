import { Consumer } from '@jamashita/publikum-type';
import { Detoxicated } from '../Interface/Detoxicated';
import { Contradiction } from './Contradiction';
import { Dead } from './Dead';
import { Schrodinger } from './Schrodinger';

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

  public isContradiction(): this is Contradiction<A, D> {
    return false;
  }

  public ifAlive(consumer: Consumer<A>): void {
    consumer(this.value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public ifDead(_consumer: Consumer<D>): void {
    // NOOP
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public ifContradiction(_consumer: Consumer<unknown>): void {
    // NOOP
  }
}
