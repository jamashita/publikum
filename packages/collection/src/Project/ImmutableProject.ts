import { Nominative } from '@jamashita/publikum-interface';
import { Mapper } from '@jamashita/publikum-type';
import { Pair } from '../Pair';
import { AProject } from './Abstract/AProject';
import { ReadonlyProject } from './Interface/ReadonlyProject';

export class ImmutableProject<K extends Nominative, V extends Nominative> extends AProject<K, V, 'ImmutableProject'> {
  public readonly noun: 'ImmutableProject' = 'ImmutableProject';

  private static readonly EMPTY: ImmutableProject<Nominative, Nominative> = new ImmutableProject<Nominative, Nominative>(new Map<string, Pair<Nominative, Nominative>>());

  public static of<KT extends Nominative, VT extends Nominative>(elements: ReadonlyProject<KT, VT>): ImmutableProject<KT, VT> {
    return ImmutableProject.ofMap<KT, VT>(elements.toMap());
  }

  public static ofMap<KT extends Nominative, VT extends Nominative>(elements: ReadonlyMap<KT, VT>): ImmutableProject<KT, VT> {
    const map: Map<string, Pair<KT, VT>> = new Map<string, Pair<KT, VT>>();

    elements.forEach((v: VT, k: KT) => {
      map.set(k.hashCode(), Pair.of(k, v));
    });

    return ImmutableProject.ofInternal<KT, VT>(map);
  }

  private static ofInternal<KT extends Nominative, VT extends Nominative>(elements: Map<string, Pair<KT, VT>>): ImmutableProject<KT, VT> {
    if (elements.size === 0) {
      return ImmutableProject.empty<KT, VT>();
    }

    return new ImmutableProject<KT, VT>(elements);
  }

  public static empty<KT extends Nominative, VT extends Nominative>(): ImmutableProject<KT, VT> {
    return ImmutableProject.EMPTY as ImmutableProject<KT, VT>;
  }

  protected constructor(elements: Map<string, Pair<K, V>>) {
    super(elements);
  }

  public set(key: K, value: V): ImmutableProject<K, V> {
    const map: Map<string, Pair<K, V>> = new Map<string, Pair<K, V>>(this.elements);

    map.set(key.hashCode(), Pair.of(key, value));

    return ImmutableProject.ofInternal<K, V>(map);
  }

  public remove(key: K): ImmutableProject<K, V> {
    if (this.isEmpty()) {
      return this;
    }

    const map: Map<string, Pair<K, V>> = new Map<string, Pair<K, V>>(this.elements);

    const deleted: boolean = map.delete(key.hashCode());

    if (deleted) {
      return ImmutableProject.ofInternal<K, V>(map);
    }

    return this;
  }

  public isEmpty(): boolean {
    if (this === ImmutableProject.empty<K, V>()) {
      return true;
    }

    return super.isEmpty();
  }

  public map<W extends Nominative>(mapper: Mapper<V, W>): ImmutableProject<K, W> {
    const map: Map<string, Pair<K, W>> = new Map<string, Pair<K, W>>();
    let i: number = 0;

    this.elements.forEach((pair: Pair<K, V>) => {
      map.set(pair.getKey().hashCode(), Pair.of<K, W>(pair.getKey(), mapper(pair.getValue(), i)));
      i++;
    });

    return ImmutableProject.ofInternal<K, W>(map);
  }

  public duplicate(): ImmutableProject<K, V> {
    if (this.isEmpty()) {
      return ImmutableProject.empty<K, V>();
    }

    const map: Map<string, Pair<K, V>> = new Map<string, Pair<K, V>>(this.elements);

    return ImmutableProject.ofInternal<K, V>(map);
  }
}
