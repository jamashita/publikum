import { Noun } from '@jamashita/publikum-interface';
import { Consumer } from '@jamashita/publikum-type';

import { Epoque } from './Interface/Epoque';

export class PassEpoque<V, E> implements Epoque<V, E>, Noun<'PassEpoque'> {
  public readonly noun: 'PassEpoque' = 'PassEpoque';
  private readonly accepted: Consumer<V>;
  private readonly declined: Consumer<E>;
  private readonly thrown: Consumer<unknown>;

  public static of<V, E>(accepted: Consumer<V>, declined: Consumer<E>, thrown: Consumer<unknown>): PassEpoque<V, E> {
    return new PassEpoque<V, E>(accepted, declined, thrown);
  }

  protected constructor(accepted: Consumer<V>, declined: Consumer<E>, thrown: Consumer<unknown>) {
    this.accepted = accepted;
    this.declined = declined;
    this.thrown = thrown;
  }

  public accept(value: V): unknown {
    return this.accept(value);
  }

  public decline(value: E): unknown {
    return this.decline(value);
  }

  public throw(error: E): unknown {
    return this.throw(error);
  }
}
