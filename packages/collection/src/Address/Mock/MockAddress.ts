import { UnimplementedError } from '@jamashita/publikum-error';
import { isNominative } from '@jamashita/publikum-interface';
import { AAddress } from '../Abstract/AAddress';

export class MockAddress<V> extends AAddress<V, MockAddress<V>, 'MockAddress'> {
  public readonly noun: 'MockAddress' = 'MockAddress';

  private static toMap<VT>(set: ReadonlySet<VT>): Map<VT | string, VT> {
    const m: Map<VT | string, VT> = new Map<VT | string, VT>();

    set.forEach((v: VT) => {
      if (isNominative(v)) {
        m.set(v.hashCode(), v);

        return;
      }

      m.set(v, v);
    });

    return m;
  }

  public constructor(set: ReadonlySet<V>) {
    super(MockAddress.toMap<V>(set));
  }

  protected forge(self: Map<unknown, V>): MockAddress<V> {
    const set: Set<V> = new Set<V>();

    self.forEach((v: V) => {
      set.add(v);
    });

    return new MockAddress<V>(set);
  }

  public add(): MockAddress<V> {
    throw new UnimplementedError();
  }

  public remove(): MockAddress<V> {
    throw new UnimplementedError();
  }

  public duplicate(): MockAddress<V> {
    throw new UnimplementedError();
  }

  public map<W>(): MockAddress<W> {
    throw new UnimplementedError();
  }
}
