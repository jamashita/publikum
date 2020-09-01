import { BinaryConsumer } from '@jamashita/publikum-type';
import { DeadConstructor } from '../Interface/DeadConstructor';
import { Chrono } from './Interface/Chrono';

export class CombinedChrono<A, D> implements Chrono<A, D, 'CombinedChrono'> {
  public readonly noun: 'CombinedChrono' = 'CombinedChrono';
  private readonly accepted: BinaryConsumer<A, ReadonlyArray<DeadConstructor<Error>>>;
  private readonly declined: BinaryConsumer<D, ReadonlyArray<DeadConstructor<Error>>>;
  private readonly thrown: BinaryConsumer<unknown, ReadonlyArray<DeadConstructor<Error>>>;

  public static of<AT, DT>(
    accepted: BinaryConsumer<AT, ReadonlyArray<DeadConstructor<Error>>>,
    declined: BinaryConsumer<DT, ReadonlyArray<DeadConstructor<Error>>>,
    thrown: BinaryConsumer<unknown, ReadonlyArray<DeadConstructor<Error>>>
  ): CombinedChrono<AT, DT> {
    return new CombinedChrono<AT, DT>(accepted, declined, thrown);
  }

  protected constructor(
    accepted: BinaryConsumer<A, ReadonlyArray<DeadConstructor<Error>>>,
    declined: BinaryConsumer<D, ReadonlyArray<DeadConstructor<Error>>>,
    thrown: BinaryConsumer<unknown, ReadonlyArray<DeadConstructor<Error>>>
  ) {
    this.accepted = accepted;
    this.declined = declined;
    this.thrown = thrown;
  }

  public accept<E extends Error>(value: A, ...errors: ReadonlyArray<DeadConstructor<E>>): unknown {
    return this.accepted(value, errors);
  }

  public decline<E extends Error>(value: D, ...errors: ReadonlyArray<DeadConstructor<E>>): unknown {
    return this.declined(value, errors);
  }

  public throw<E extends Error>(cause: unknown, ...errors: ReadonlyArray<DeadConstructor<E>>): unknown {
    return this.thrown(cause, errors);
  }
}
