import { Detoxicated } from '@jamashita/publikum-monad';
import { DeadConstructor } from '../Interface/DeadConstructor';
import { AcceptChrono } from './Interface/AcceptChrono';
import { Chrono } from './Interface/Chrono';
import { DeclineChrono } from './Interface/DeclineChrono';
import { ThrowChrono } from './Interface/ThrowChrono';

export class CombinedChrono<A, D extends Error> implements Chrono<A, D, D, 'CombinedChrono'> {
  public readonly noun: 'CombinedChrono' = 'CombinedChrono';
  private readonly map: AcceptChrono<A, D>;
  private readonly recover: DeclineChrono<D, D>;
  private readonly destroy: ThrowChrono<D>;
  private readonly errors: Set<DeadConstructor<D>>;

  public static of<AT, DT extends Error>(map: AcceptChrono<AT, DT>, recover: DeclineChrono<DT, DT>, destroy: ThrowChrono<DT>, errors: Set<DeadConstructor<DT>>): CombinedChrono<AT, DT> {
    return new CombinedChrono<AT, DT>(map, recover, destroy, errors);
  }

  protected constructor(map: AcceptChrono<A, D>, recover: DeclineChrono<D>, destroy: ThrowChrono<D>, errors: Set<DeadConstructor<D>>) {
    this.map = map;
    this.recover = recover;
    this.destroy = destroy;
    this.errors = errors;
  }

  public accept(value: Detoxicated<A>): unknown {
    this.map.catch([...this.errors]);

    return this.map.accept(value);
  }

  public decline(value: D): unknown {
    this.recover.catch([...this.errors]);

    return this.recover.decline(value);
  }

  public throw(cause: unknown): unknown {
    this.destroy.catch([...this.errors]);

    return this.destroy.throw(cause);
  }

  public catch(errors: ReadonlyArray<DeadConstructor<D>>): void {
    errors.forEach((error: DeadConstructor<D>) => {
      this.errors.add(error);
    });
  }

  public getErrors(): Set<DeadConstructor<D>> {
    return new Set<DeadConstructor<D>>(this.errors);
  }
}
