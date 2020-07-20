import { Consumer } from '@jamashita/publikum-type';
import { Alive } from './Alive';
import { Contradiction } from './Contradiction';
import { Schrodinger } from './Schrodinger';

export class Dead<A, D extends Error> implements Schrodinger<A, D, 'Dead'> {
  public readonly noun: 'Dead' = 'Dead';
  private readonly error: D;

  public static of<A, D extends Error>(error: D): Dead<A, D> {
    return new Dead<A, D>(error);
  }

  protected constructor(error: D) {
    this.error = error;
  }

  public get(): never {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw this.error;
  }

  public isAlive(): this is Alive<A, D> {
    return false;
  }

  public isDead(): this is Dead<A, D> {
    return true;
  }

  public isContradiction(): this is Contradiction<A, D> {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public ifAlive(_consumer: Consumer<A>): void {
    // NOOP
  }

  public ifDead(consumer: Consumer<D>): void {
    consumer(this.error);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public ifContradiction(_consumer: Consumer<unknown>): void {
    // NOOP
  }

  public getError(): D {
    return this.error;
  }
}
