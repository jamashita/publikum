import { UnimplementedError } from '@publikum/error';
import { Nominative } from '@publikum/interface';

import { AProject } from '../Abstract/AProject';
import { Project } from '../Interface/Project';

export class MockAProject<K extends Nominative, V extends Nominative> extends AProject<K, V> implements Project<K, V> {
  public readonly noun: 'MockAProject' = 'MockAProject';

  private static constructMap<K extends Nominative, V extends Nominative>(elements: Map<K, V>): Map<string, [K, V]> {
    const map: Map<string, [K, V]> = new Map<string, [K, V]>();

    elements.forEach((v: V, k: K) => {
      map.set(k.hashCode(), [k, v]);
    });

    return map;
  }

  public constructor(elements: Map<K, V>) {
    super(MockAProject.constructMap<K, V>(elements));
  }

  public set(): Project<K, V> {
    throw new UnimplementedError();
  }

  public remove(): Project<K, V> {
    throw new UnimplementedError();
  }

  public duplicate(): Project<K, V> {
    throw new UnimplementedError();
  }
}
