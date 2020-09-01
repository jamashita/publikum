import { UnimplementedError } from '@jamashita/publikum-error';
import { Nominative } from '@jamashita/publikum-interface';
import { Pair } from '../../Pair';
import { AProject } from '../Abstract/AProject';

// TODO RENAME TO MockProject
export class MockAProject<K extends Nominative<K>, V extends Nominative<V>> extends AProject<K, V, 'MockAProject'> {
  public readonly noun: 'MockAProject' = 'MockAProject';

  private static constructMap<KT extends Nominative<KT>, VT extends Nominative<VT>>(
    elements: Map<KT, VT>
  ): Map<string, Pair<KT, VT>> {
    const map: Map<string, Pair<KT, VT>> = new Map<string, Pair<KT, VT>>();

    elements.forEach((v: VT, k: KT) => {
      map.set(k.hashCode(), Pair.of(k, v));
    });

    return map;
  }

  public constructor(elements: Map<K, V>) {
    super(MockAProject.constructMap<K, V>(elements));
  }

  public set(): MockAProject<K, V> {
    throw new UnimplementedError();
  }

  public remove(): MockAProject<K, V> {
    throw new UnimplementedError();
  }

  public duplicate(): MockAProject<K, V> {
    throw new UnimplementedError();
  }
}
