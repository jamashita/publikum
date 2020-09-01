import { Consumer } from '@jamashita/publikum-type';

import { Epoque } from './Interface/Epoque';

export class CombinedEpoque<A, D> implements Epoque<A, D, 'CombinedEpoque'> {
  public readonly noun: 'CombinedEpoque' = 'CombinedEpoque';
  private readonly accepted: Consumer<A>;
  private readonly declined: Consumer<D>;
  private readonly thrown: Consumer<unknown>;

  public static of<A, D>(
    accepted: Consumer<A>,
    declined: Consumer<D>,
    thrown: Consumer<unknown>
  ): CombinedEpoque<A, D> {
    return new CombinedEpoque<A, D>(accepted, declined, thrown);
  }

  protected constructor(accepted: Consumer<A>, declined: Consumer<D>, thrown: Consumer<unknown>) {
    this.accepted = accepted;
    this.declined = declined;
    this.thrown = thrown;
  }

  public accept(value: A): unknown | void {
    return this.accepted(value);
  }

  public decline(value: D): unknown | void {
    return this.declined(value);
  }

  public throw(cause: D): unknown | void {
    return this.thrown(cause);
  }
}
