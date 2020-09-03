import { Consumer } from '@jamashita/publikum-type';
import { Matter } from '../Interface/Matter';
import { Epoque } from './Interface/Epoque';

export class PassThroughEpoque<P> implements Epoque<P, 'PassThroughEpoque'> {
  public readonly noun: 'PassThroughEpoque' = 'PassThroughEpoque';
  private readonly map: Consumer<Matter<P>>;
  private readonly recover: Consumer<void>;
  private readonly destroy: Consumer<unknown>;

  public static of<PT>(map: Consumer<Matter<PT>>, recover: Consumer<void>, destroy: Consumer<unknown>): PassThroughEpoque<PT> {
    return new PassThroughEpoque<PT>(map, recover, destroy);
  }

  protected constructor(map: Consumer<Matter<P>>, recover: Consumer<void>, destroy: Consumer<unknown>) {
    this.map = map;
    this.recover = recover;
    this.destroy = destroy;
  }

  public accept(value: Matter<P>): unknown {
    return this.map(value);
  }

  public decline(): unknown {
    return this.recover();
  }

  public throw(cause: unknown): unknown {
    return this.destroy(cause);
  }
}
