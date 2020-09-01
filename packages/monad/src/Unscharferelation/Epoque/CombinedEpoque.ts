import { Consumer } from '@jamashita/publikum-type';
import { Epoque } from './Interface/Epoque';

export class CombinedEpoque<A> implements Epoque<A, 'CombinedEpoque'> {
  public readonly noun: 'CombinedEpoque' = 'CombinedEpoque';
  private readonly accepted: Consumer<A>;
  private readonly declined: Consumer<void>;
  private readonly thrown: Consumer<unknown>;

  public static of<AT>(
    accepted: Consumer<AT>,
    declined: Consumer<void>,
    thrown: Consumer<unknown>
  ): CombinedEpoque<AT> {
    return new CombinedEpoque<AT>(accepted, declined, thrown);
  }

  protected constructor(accepted: Consumer<A>, declined: Consumer<void>, thrown: Consumer<unknown>) {
    this.accepted = accepted;
    this.declined = declined;
    this.thrown = thrown;
  }

  public accept(value: A): unknown | void {
    return this.accepted(value);
  }

  public decline(): unknown | void {
    return this.declined();
  }

  public throw(cause: unknown): unknown | void {
    return this.thrown(cause);
  }
}
