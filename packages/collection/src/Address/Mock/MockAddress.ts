import { UnimplementedError } from '@jamashita/publikum-error';
import { Nominative } from '@jamashita/publikum-interface';
import { AAddress } from '../Abstract/AAddress';

export class MockAddress<V extends Nominative> extends AAddress<V, 'MockAddress'> {
  public readonly noun: 'MockAddress' = 'MockAddress';

  private static constructMap<VT extends Nominative>(elements: ReadonlySet<VT>): Map<string, VT> {
    const map: Map<string, VT> = new Map<string, VT>();

    elements.forEach((e: VT) => {
      map.set(e.hashCode(), e);
    });

    return map;
  }

  public constructor(elements: ReadonlySet<V>) {
    super(MockAddress.constructMap<V>(elements));
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
