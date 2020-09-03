import { Matter } from '@jamashita/publikum-monad';
import { AcceptEpoque } from './Interface/AcceptEpoque';
import { DeclineEpoque } from './Interface/DeclineEpoque';
import { Epoque } from './Interface/Epoque';
import { ThrowEpoque } from './Interface/ThrowEpoque';

export class CombinedEpoque<A> implements Epoque<A, 'CombinedEpoque'> {
  public readonly noun: 'CombinedEpoque' = 'CombinedEpoque';
  private readonly map: AcceptEpoque<A>;
  private readonly recover: DeclineEpoque;
  private readonly destroy: ThrowEpoque;

  public static of<AT>(map: AcceptEpoque<AT>, recover: DeclineEpoque, destroy: ThrowEpoque): CombinedEpoque<AT> {
    return new CombinedEpoque<AT>(map, recover, destroy);
  }

  protected constructor(map: AcceptEpoque<A>, recover: DeclineEpoque, destroy: ThrowEpoque) {
    this.map = map;
    this.recover = recover;
    this.destroy = destroy;
  }

  public accept(value: Matter<A>): unknown | void {
    return this.map.accept(value);
  }

  public decline(): unknown | void {
    return this.recover.decline();
  }

  public throw(cause: unknown): unknown | void {
    return this.destroy.throw(cause);
  }
}
