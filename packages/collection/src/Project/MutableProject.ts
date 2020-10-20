import { Nominative } from '@jamashita/publikum-interface';
import { Mapper } from '@jamashita/publikum-type';
import { Pair } from '../Pair';
import { AProject } from './Abstract/AProject';
import { ReadonlyProject } from './Interface/ReadonlyProject';

export class MutableProject<K extends Nominative, V extends Nominative> extends AProject<K, V, 'MutableProject'> {
  public readonly noun: 'MutableProject' = 'MutableProject';

  public static of<KT extends Nominative, VT extends Nominative>(elements: ReadonlyProject<KT, VT>): MutableProject<KT, VT> {
    return MutableProject.ofMap<KT, VT>(elements.toMap());
  }

  public static ofMap<KT extends Nominative, VT extends Nominative>(elements: ReadonlyMap<KT, VT>): MutableProject<KT, VT> {
    const map: Map<string, Pair<KT, VT>> = new Map<string, Pair<KT, VT>>();

    elements.forEach((v: VT, k: KT) => {
      map.set(k.hashCode(), Pair.of(k, v));
    });

    return MutableProject.ofInternal<KT, VT>(map);
  }

  private static ofInternal<KT extends Nominative, VT extends Nominative>(elements: Map<string, Pair<KT, VT>>): MutableProject<KT, VT> {
    return new MutableProject<KT, VT>(elements);
  }

  public static empty<KT extends Nominative, VT extends Nominative>(): MutableProject<KT, VT> {
    return new MutableProject<KT, VT>(new Map<string, Pair<KT, VT>>());
  }

  protected constructor(elements: ReadonlyMap<string, Pair<K, V>>) {
    super(elements);
  }

  public set(key: K, value: V): MutableProject<K, V> {
    this.elements.set(key.hashCode(), Pair.of(key, value));

    return this;
  }

  public remove(key: K): MutableProject<K, V> {
    if (this.isEmpty()) {
      return this;
    }
    if (!this.has(key)) {
      return this;
    }

    this.elements.delete(key.hashCode());

    return this;
  }

  public map<W extends Nominative>(mapper: Mapper<V, W>): MutableProject<K, W> {
    const project: MutableProject<K, W> = MutableProject.empty<K, W>();
    let i: number = 0;

    this.elements.forEach((pair: Pair<K, V>) => {
      project.set(pair.getKey(), mapper(pair.getValue(), i));
      i++;
    });

    return project;
  }

  public duplicate(): MutableProject<K, V> {
    return MutableProject.ofInternal<K, V>(new Map<string, Pair<K, V>>(this.elements));
  }
}
