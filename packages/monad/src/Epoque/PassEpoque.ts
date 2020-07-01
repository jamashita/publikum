import { Noun } from '@jamashita/publikum-interface';
import { Reject, Resolve } from '@jamashita/publikum-type';

import { Epoque } from './Interface/Epoque';

export class PassEpoque<V, E> implements Epoque<V, E>, Noun<'PassEpoque'> {
  public readonly noun: 'PassEpoque' = 'PassEpoque';
  private readonly resolved: Resolve<V>;
  private readonly rejected: Reject<E>;

  public static of<V, E>(resolved: Resolve<V>, rejected: Reject<E>): PassEpoque<V, E> {
    return new PassEpoque<V, E>(resolved, rejected);
  }

  protected constructor(resolved: Resolve<V>, rejected: Reject<E>) {
    this.resolved = resolved;
    this.rejected = rejected;
  }

  public resolve(value: V): unknown {
    return this.resolved(value);
  }

  public reject(error: E): unknown {
    return this.rejected(error);
  }
}
