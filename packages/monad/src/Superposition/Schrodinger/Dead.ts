import { ValueObject } from '@jamashita/publikum-object';
import { Consumer, Kind } from '@jamashita/publikum-type';
import { Alive } from './Alive';
import { Contradiction } from './Contradiction';
import { Schrodinger } from './Schrodinger';

export class Dead<A, D extends Error> extends ValueObject<Dead<A, D>, 'Dead'> implements Schrodinger<A, D, 'Dead'> {
  public readonly noun: 'Dead' = 'Dead';
  private readonly error: D;

  public static of<AT, DT extends Error>(error: DT): Dead<AT, DT> {
    return new Dead<AT, DT>(error);
  }

  protected constructor(error: D) {
    super();
    this.error = error;
  }

  public serialize(): string {
    return `Dead: ${Kind.notate(this.error)}`;
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

  public equals(other: Schrodinger<A, D>): boolean {
    if (this === other) {
      return true;
    }
    if (!other.isDead()) {
      return false;
    }
    if (this.error.name === other.error.name) {
      return true;
    }

    return false;
  }

  public getError(): D {
    return this.error;
  }
}
