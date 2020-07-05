import { SuperpositionError } from '../Error/SuperpositionError';
import { Alive } from './Alive';
import { Dead } from './Dead';
import { Schrodinger } from './Schrodinger';

// TODO TEST UNDONE
export class Contradiction<A, D extends Error> implements Schrodinger<A, D, 'Contradiction'> {
  public readonly noun: 'Contradiction' = 'Contradiction';

  private static readonly INSTANCE: Contradiction<unknown, Error> = new Contradiction<unknown, Error>();

  public static of<A, D extends Error>(): Contradiction<A, D> {
    return (Contradiction.INSTANCE as unknown) as Contradiction<A, D>;
  }

  protected constructor() {
    // NOOP
  }

  public get(): never {
    throw new SuperpositionError('CONTRADICTION');
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
}
