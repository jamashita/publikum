import { Consumer } from '@jamashita/publikum-type';
import { SuperpositionError } from '../Error/SuperpositionError';
import { Alive } from './Alive';
import { Contradiction } from './Contradiction';
import { Dead } from './Dead';
import { Schrodinger } from './Schrodinger';

export class Still<A, D extends Error> implements Schrodinger<A, D, 'Still'> {
  public readonly noun: 'Still' = 'Still';

  private static readonly INSTANCE: Still<unknown, Error> = new Still<unknown, Error>();

  public static of<A, D extends Error>(): Still<A, D> {
    return (Still.INSTANCE as unknown) as Still<A, D>;
  }

  protected constructor() {
    // NOOP
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
}
