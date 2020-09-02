import { Matter } from '@jamashita/publikum-monad';
import { Consumer } from '@jamashita/publikum-type';
import { Epoque } from './Interface/Epoque';

export class CombinedEpoque<A> implements Epoque<Matter<A>, 'CombinedEpoque'> {
  public readonly noun: 'CombinedEpoque' = 'CombinedEpoque';
  private readonly map: Consumer<Matter<A>>;
  private readonly recover: Consumer<void>;
  private readonly destroy: Consumer<unknown>;

  public static of<AT>(
    map: Consumer<Matter<AT>>,
    recover: Consumer<void>,
    destroy: Consumer<unknown>
  ): CombinedEpoque<AT> {
    return new CombinedEpoque<AT>(map, recover, destroy);
  }

  protected constructor(map: Consumer<Matter<A>>, recover: Consumer<void>, destroy: Consumer<unknown>) {
    this.map = map;
    this.recover = recover;
    this.destroy = destroy;
  }

  public accept(value: Matter<A>): unknown | void {
    return this.map(value);
  }

  public decline(): unknown | void {
    return this.recover();
  }

  public throw(cause: unknown): unknown | void {
    return this.destroy(cause);
  }
}
