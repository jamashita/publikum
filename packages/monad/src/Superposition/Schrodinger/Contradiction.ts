import { Consumer } from '@jamashita/publikum-type';
import { Alive } from './Alive';
import { Dead } from './Dead';
import { Schrodinger } from './Schrodinger';

export class Contradiction<A, D extends Error> implements Schrodinger<A, D, 'Contradiction'> {
  public readonly noun: 'Contradiction' = 'Contradiction';
  private readonly cause: unknown;

  public static of<A, D extends Error>(cause: unknown): Contradiction<A, D> {
    return new Contradiction<A, D>(cause);
  }

  protected constructor(cause: unknown) {
    this.cause = cause;
  }

  public get(): never {
    throw this.cause;
  }

  public isAlive(): this is Alive<A, D> {
    return false;
  }

  public isDead(): this is Dead<A, D> {
    return false;
  }

  public isContradiction(): this is Contradiction<A, D> {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public ifAlive(_consumer: Consumer<A>): void {
    // NOOP
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public ifDead(_consumer: Consumer<D>): void {
    // NOOP
  }

  public ifContradiction(consumer: Consumer<unknown>): void {
    consumer(this.cause);
  }

  public equals(other: Schrodinger<A, D>): boolean {
    if (this === other) {
      return true;
    }

    return other.isContradiction();
  }

  public getCause(): unknown {
    return this.cause;
  }
}
