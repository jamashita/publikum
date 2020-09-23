import { ValueObject } from '@jamashita/publikum-object';
import { SuperpositionError } from '../Error/SuperpositionError';
import { Alive } from './Alive';
import { Contradiction } from './Contradiction';
import { Dead } from './Dead';
import { Schrodinger } from './Schrodinger';

export class Still<A, D extends Error> extends ValueObject<'Still'> implements Schrodinger<A, D, 'Still'> {
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

  public ifAlive(): void {
    // NOOP
  }

  public ifDead(): void {
    // NOOP
  }

  public ifContradiction(): void {
    // NOOP
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof Still)) {
      return false;
    }

    return true;
  }
}
