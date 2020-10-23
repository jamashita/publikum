import { UnimplementedError } from '@jamashita/publikum-error';
import { Nominative } from '@jamashita/publikum-interface';
import { AAddress } from '../Abstract/AAddress';

export class MockAddress<V extends Nominative> extends AAddress<V, 'MockAddress'> {
  public readonly noun: 'MockAddress' = 'MockAddress';

  private static toMap<VT extends Nominative>(set: ReadonlySet<VT>): Map<string, VT> {
    const m: Map<string, VT> = new Map<string, VT>();

    set.forEach((v: VT) => {
      m.set(v.hashCode(), v);
    });

    return m;
  }

  public constructor(set: ReadonlySet<V>) {
    super(MockAddress.toMap<V>(set));
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

  public map<W extends Nominative>(): MockAddress<W> {
    throw new UnimplementedError();
  }
}
