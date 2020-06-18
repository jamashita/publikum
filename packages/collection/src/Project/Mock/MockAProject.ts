import { UnimplementedError } from '@jamashita/publikum-error';
import { Nominative } from '@jamashita/publikum-interface';

import { Pair } from '../../Pair';
import { AProject } from '../Abstract/AProject';

export class MockAProject<K extends Nominative<K>, V extends Nominative<V>> extends AProject<K, V, 'MockAProject'> {
  public readonly noun: 'MockAProject' = 'MockAProject';

  private static constructMap<K extends Nominative<K>, V extends Nominative<V>>(
    elements: Map<K, V>
  ): Map<string, Pair<K, V>> {
    const map: Map<string, Pair<K, V>> = new Map<string, Pair<K, V>>();

    elements.forEach((v: V, k: K) => {
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

  public iterator(): Iterator<Pair<K, V>> {
    throw new UnimplementedError();
  }
}
