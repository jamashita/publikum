import { UnimplementedError } from '@jamashita/publikum-error';
import { Nominative } from '@jamashita/publikum-interface';
import { Pair } from '../../Pair';
import { AProject } from '../Abstract/AProject';

export class MockProject<K extends Nominative, V extends Nominative> extends AProject<K, V, MockProject<K, V>, 'MockProject'> {
  public readonly noun: 'MockProject' = 'MockProject';

  private static toMap<KT extends Nominative, VT extends Nominative>(project: Map<KT, VT>): Map<string, Pair<KT, VT>> {
    const map: Map<string, Pair<KT, VT>> = new Map<string, Pair<KT, VT>>();

    project.forEach((v: VT, k: KT) => {
      map.set(k.hashCode(), Pair.of(k, v));
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

  public map<W extends Nominative>(): MockProject<K, W> {
    throw new UnimplementedError();
  }

  public duplicate(): MockProject<K, V> {
    throw new UnimplementedError();
  }

  protected forge(self: Map<string, Pair<K, V>>): MockProject<K, V> {
    const map: Map<K, V> = new Map<K, V>();

    self.forEach((p: Pair<K, V>) => {
      map.set(p.getKey(), p.getValue());
    });

    return new MockProject<K, V>(map);
  }
}
