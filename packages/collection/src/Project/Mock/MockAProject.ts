import { UnimplementedError } from '@jamashita/publikum-error';
import { Nominative } from '@jamashita/publikum-interface';

import { AProject } from '../Abstract/AProject';

export class MockAProject<K extends Nominative<K>, V extends Nominative<V>> extends AProject<K, V, 'MockAProject'> {
  public readonly noun: 'MockAProject' = 'MockAProject';

  private static constructMap<K extends Nominative<K>, V extends Nominative<V>>(
    elements: Map<K, V>
  ): Map<string, [K, V]> {
    const map: Map<string, [K, V]> = new Map<string, [K, V]>();

    elements.forEach((v: V, k: K) => {
      map.set(k.hashCode(), [k, v]);
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
