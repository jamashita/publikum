import { ReadonlyProject } from '@jamashita/publikum-collection';
import { UnimplementedError } from '@jamashita/publikum-error';
import { Nominative } from '@jamashita/publikum-interface';
import { Pair } from '../../Pair';
import { AProject } from '../Abstract/AProject';

export class MockProject<K extends Nominative, V extends Nominative> extends AProject<K, V, 'MockProject'> {
  public readonly noun: 'MockProject' = 'MockProject';

  private static constructMap<KT extends Nominative, VT extends Nominative>(elements: Map<KT, VT>): Map<string, Pair<KT, VT>> {
    const map: Map<string, Pair<KT, VT>> = new Map<string, Pair<KT, VT>>();

    elements.forEach((v: VT, k: KT) => {
      map.set(k.hashCode(), Pair.of(k, v));
    });

    return map;
  }

  public constructor(elements: Map<K, V>) {
    super(MockProject.constructMap<K, V>(elements));
  }

  public set(): MockProject<K, V> {
    throw new UnimplementedError();
  }

  public remove(): MockProject<K, V> {
    throw new UnimplementedError();
  }

  public map<W extends Nominative>(): ReadonlyProject<K, W> {
    throw new UnimplementedError();
  }

  public duplicate(): MockProject<K, V> {
    throw new UnimplementedError();
  }
}
