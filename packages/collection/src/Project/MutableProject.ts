import { Nominative } from '@jamashita/publikum-interface';
import { Mapper } from '@jamashita/publikum-type';
import { Pair } from '../Pair';
import { AProject } from './Abstract/AProject';
import { ReadonlyProject } from './Interface/ReadonlyProject';

export class MutableProject<K extends Nominative, V extends Nominative> extends AProject<K, V, MutableProject<K, V>, 'MutableProject'> {
  public readonly noun: 'MutableProject' = 'MutableProject';

  public static of<KT extends Nominative, VT extends Nominative>(project: ReadonlyProject<KT, VT>): MutableProject<KT, VT> {
    return MutableProject.ofMap<KT, VT>(project.toMap());
  }

  public static ofMap<KT extends Nominative, VT extends Nominative>(map: ReadonlyMap<KT, VT>): MutableProject<KT, VT> {
    const m: Map<string, Pair<KT, VT>> = new Map<string, Pair<KT, VT>>();

    map.forEach((v: VT, k: KT) => {
      m.set(k.hashCode(), Pair.of(k, v));
    });

    return MutableProject.ofInternal<KT, VT>(m);
  }

  private static ofInternal<KT extends Nominative, VT extends Nominative>(project: Map<string, Pair<KT, VT>>): MutableProject<KT, VT> {
    return new MutableProject<KT, VT>(project);
  }

  public static empty<KT extends Nominative, VT extends Nominative>(): MutableProject<KT, VT> {
    return new MutableProject<KT, VT>(new Map<string, Pair<KT, VT>>());
  }

  protected constructor(project: ReadonlyMap<string, Pair<K, V>>) {
    super(project);
  }

  protected forge(self: Map<K, V>): MutableProject<K, V> {
    return MutableProject.ofMap<K, V>(self);
  }

  public set(key: K, value: V): MutableProject<K, V> {
    this.project.set(key.hashCode(), Pair.of(key, value));

    return this;
  }

  public remove(key: K): MutableProject<K, V> {
    if (this.isEmpty()) {
      return this;
    }
    if (!this.has(key)) {
      return this;
    }

    this.project.delete(key.hashCode());

    return this;
  }

  public map<W extends Nominative>(mapper: Mapper<V, W>): MutableProject<K, W> {
    const m: Map<string, Pair<K, W>> = this.mapInternal<W>(mapper);

    return MutableProject.ofInternal<K, W>(m);
  }

  public duplicate(): MutableProject<K, V> {
    return MutableProject.ofInternal<K, V>(new Map<string, Pair<K, V>>(this.project));
  }
}
