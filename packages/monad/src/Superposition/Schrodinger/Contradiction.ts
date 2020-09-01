import { ValueObject } from '@jamashita/publikum-object';
import { Consumer, Kind } from '@jamashita/publikum-type';
import { Alive } from './Alive';
import { Dead } from './Dead';
import { Schrodinger } from './Schrodinger';

export class Contradiction<A, D extends Error> extends ValueObject<Contradiction<A, D>, 'Contradiction'> implements Schrodinger<A, D, 'Contradiction'> {
  public readonly noun: 'Contradiction' = 'Contradiction';
  private readonly cause: unknown;

  public static of<AT, DT extends Error>(cause: unknown): Contradiction<AT, DT> {
    return new Contradiction<AT, DT>(cause);
  }

  protected constructor(cause: unknown) {
    super();
    this.cause = cause;
  }

  public serialize(): string {
    return `Contradiction: ${Kind.notate(this.cause)}`;
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
