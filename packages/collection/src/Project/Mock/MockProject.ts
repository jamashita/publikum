import { UnimplementedError } from '@jamashita/publikum-error';
import { isNominative } from '@jamashita/publikum-interface';
import { AProject } from '../Abstract/AProject';

export class MockProject<K, V> extends AProject<K, V, MockProject<K, V>, 'MockProject'> {
  public readonly noun: 'MockProject' = 'MockProject';

  private static toMap<KT, VT>(project: Map<KT, VT>): Map<KT | string, [KT, VT]> {
    const map: Map<KT | string, [KT, VT]> = new Map<KT | string, [KT, VT]>();

    project.forEach((v: VT, k: KT) => {
      if (isNominative(k)) {
        map.set(k.hashCode(), [k, v]);

        return;
      }

      map.set(k, [k, v]);
    });

    return map;
  }

  public constructor(project: Map<K, V>) {
    super(MockProject.toMap<K, V>(project));
  }

  public set(): MockProject<K, V> {
    throw new UnimplementedError();
  }

  public remove(): MockProject<K, V> {
    throw new UnimplementedError();
  }

  public map<W>(): MockProject<K, W> {
    throw new UnimplementedError();
  }

  public duplicate(): MockProject<K, V> {
    throw new UnimplementedError();
  }

  protected forge(self: Map<string, [K, V]>): MockProject<K, V> {
    const map: Map<K, V> = new Map<K, V>();

    self.forEach(([k, v]: [K, V]) => {
      map.set(k, v);
    });

    return new MockProject<K, V>(map);
  }
}
