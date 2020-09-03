import { Detoxicated } from '@jamashita/publikum-monad';
import { Consumer } from '@jamashita/publikum-type';
import { DeadConstructor } from '../Interface/DeadConstructor';
import { Chrono } from './Interface/Chrono';

export class PassThroughChrono<A, D extends Error> implements Chrono<A, D, D, 'PassThroughChrono'> {
  public readonly noun: 'PassThroughChrono' = 'PassThroughChrono';
  private readonly map: Consumer<Detoxicated<A>>;
  private readonly recover: Consumer<D>;
  private readonly destroy: Consumer<unknown>;
  private readonly errors: Set<DeadConstructor<D>>;

  public static of<AT, DT extends Error>(map: Consumer<Detoxicated<AT>>, recover: Consumer<DT>, destroy: Consumer<unknown>, ...errors: ReadonlyArray<DeadConstructor<DT>>): PassThroughChrono<AT, DT> {
    return new PassThroughChrono<AT, DT>(map, recover, destroy, errors);
  }

  protected constructor(map: Consumer<Detoxicated<A>>, recover: Consumer<D>, destroy: Consumer<unknown>, errors: ReadonlyArray<DeadConstructor<D>>) {
    this.map = map;
    this.recover = recover;
    this.destroy = destroy;
    this.errors = new Set<DeadConstructor<D>>(errors);
  }

  public accept(value: Detoxicated<A>): unknown {
    return this.map(value);
  }

  public decline(value: D): unknown {
    return this.recover(value);
  }

  public throw(cause: unknown): unknown {
    return this.destroy(cause);
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
