import { ValueObject } from '@jamashita/publikum-object';
import { Consumer } from '@jamashita/publikum-type';
import { SuperpositionError } from '../Error/SuperpositionError';
import { Alive } from './Alive';
import { Contradiction } from './Contradiction';
import { Dead } from './Dead';
import { Schrodinger } from './Schrodinger';

export class Still<A, D extends Error> extends ValueObject<Still<A, D>, 'Still'> implements Schrodinger<A, D, 'Still'> {
  public readonly noun: 'Still' = 'Still';
  private static readonly INSTANCE: Still<unknown, Error> = new Still<unknown, Error>();

  public static of<AT, DT extends Error>(): Still<AT, DT> {
    return (Still.INSTANCE as unknown) as Still<AT, DT>;
  }

  protected constructor() {
    super();
  }

  public serialize(): string {
    return 'Still';
  }

  public get(): never {
    throw new SuperpositionError('STILL');
  }

  public isAlive(): this is Alive<A, D> {
    return false;
  }

  public isDead(): this is Dead<A, D> {
    return false;
  }

  public isContradiction(): this is Contradiction<A, D> {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public ifAlive(_consumer: Consumer<A>): void {
    // NOOP
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

    return false;
  }
}
