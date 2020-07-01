import { Alive } from './Alive';
import { Dead } from './Dead';
import { SuperpositionError } from '../Error/SuperpositionError';
import { Schrodinger } from './Schrodinger';

export class Still<A, D extends Error> implements Schrodinger<A, D, 'Still'> {
  public readonly noun: 'Still' = 'Still';

  private static readonly INSTANCE: Still<unknown, Error> = new Still<unknown, Error>();

  public static of<A, D extends Error>(): Still<A, D> {
    return Still.INSTANCE.transpose<A, D>();
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

  public transpose<B, E extends Error>(): Still<B, E> {
    return (this as unknown) as Still<B, E>;
  }
}
