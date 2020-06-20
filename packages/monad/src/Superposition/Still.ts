import { Alive } from './Alive';
import { Dead } from './Dead';
import { SuperpositionError } from './Error/SuperpositionError';
import { Schrodinger } from './Schrodinger';

export class Still<S, F extends Error> implements Schrodinger<S, F, 'Still'> {
  public readonly noun: 'Still' = 'Still';

  private static readonly INSTANCE: Still<unknown, SuperpositionError> = new Still<unknown, SuperpositionError>();

  public static of<S, F extends Error>(): Still<S, F> {
    return Still.INSTANCE.transpose<S, F>();
  }

  protected constructor() {
    // NOOP
  }

  public get(): never {
    throw new SuperpositionError('STILL');
  }

  public isAlive(): this is Alive<S, F> {
    return false;
  }

  public isDead(): this is Dead<S, F> {
    return false;
  }

  public isStill(): this is Still<S, F> {
    return true;
  }

  public transpose<T, E extends Error>(): Still<T, E> {
    return (this as unknown) as Still<T, E>;
  }

  /*
   * public toQuantum(): never {
   *   throw new SuperpositionError('STILL');
   * }
   */
}
