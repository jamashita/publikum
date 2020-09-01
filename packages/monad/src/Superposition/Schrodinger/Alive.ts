import { isEqualable } from '@jamashita/publikum-interface';
import { ValueObject } from '@jamashita/publikum-object';
import { Consumer, Kind } from '@jamashita/publikum-type';
import { Detoxicated } from '../Interface/Detoxicated';
import { Contradiction } from './Contradiction';
import { Dead } from './Dead';
import { Schrodinger } from './Schrodinger';

export class Alive<A, D extends Error> extends ValueObject<Alive<A, D>, 'Alive'> implements Schrodinger<A, D, 'Alive'> {
  public readonly noun: 'Alive' = 'Alive';
  private readonly value: Detoxicated<A>;

  public static of<AT, DT extends Error>(value: Detoxicated<AT>): Alive<AT, DT> {
    return new Alive<AT, DT>(value);
  }

  protected constructor(value: Detoxicated<A>) {
    super();
    this.value = value;
  }

  public serialize(): string {
    return `Alive: ${Kind.notate(this.value)}`;
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

  public equals(other: Schrodinger<A, D>): boolean {
    if (this === other) {
      return true;
    }
    if (!other.isAlive()) {
      return false;
    }
    if (this.value === other.value) {
      return true;
    }
    if (isEqualable(this.value)) {
      if (isEqualable(other.value)) {
        return this.value.equals(other.value);
      }
    }

    return false;
  }
}
