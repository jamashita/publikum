import { Nominative } from '@jamashita/publikum-interface';
import { Mapper } from '@jamashita/publikum-type';
import { Pair } from '../Pair';
import { AProject } from './Abstract/AProject';
import { ReadonlyProject } from './Interface/ReadonlyProject';

export class ImmutableProject<K extends Nominative, V extends Nominative> extends AProject<K, V, ImmutableProject<K, V>, 'ImmutableProject'> {
  public readonly noun: 'ImmutableProject' = 'ImmutableProject';
  private static readonly EMPTY: ImmutableProject<Nominative, Nominative> = new ImmutableProject<Nominative, Nominative>(new Map<string, Pair<Nominative, Nominative>>());

  public static of<KT extends Nominative, VT extends Nominative>(project: ReadonlyProject<KT, VT>): ImmutableProject<KT, VT> {
    return ImmutableProject.ofMap<KT, VT>(project.toMap());
  }

  public static ofMap<KT extends Nominative, VT extends Nominative>(map: ReadonlyMap<KT, VT>): ImmutableProject<KT, VT> {
    const m: Map<string, Pair<KT, VT>> = new Map<string, Pair<KT, VT>>();

    map.forEach((v: VT, k: KT) => {
      m.set(k.hashCode(), Pair.of(k, v));
    });

    return ImmutableProject.ofInternal<KT, VT>(m);
  }

  private static ofInternal<KT extends Nominative, VT extends Nominative>(project: ReadonlyMap<string, Pair<KT, VT>>): ImmutableProject<KT, VT> {
    if (project.size === 0) {
      return ImmutableProject.empty<KT, VT>();
    }

    return new ImmutableProject<KT, VT>(project);
  }

  public static empty<KT extends Nominative, VT extends Nominative>(): ImmutableProject<KT, VT> {
    return ImmutableProject.EMPTY as ImmutableProject<KT, VT>;
  }

  protected constructor(project: ReadonlyMap<string, Pair<K, V>>) {
    super(project);
  }

  protected forge(self: Map<string, Pair<K, V>>): ImmutableProject<K, V> {
    return ImmutableProject.ofInternal<K, V>(self);
  }

  public set(key: K, value: V): ImmutableProject<K, V> {
    const m: Map<string, Pair<K, V>> = new Map<string, Pair<K, V>>(this.project);

    m.set(key.hashCode(), Pair.of(key, value));

    return ImmutableProject.ofInternal<K, V>(m);
  }

  public remove(key: K): ImmutableProject<K, V> {
    if (this.isEmpty()) {
      return this;
    }
    if (!this.has(key)) {
      return this;
    }

    const m: Map<string, Pair<K, V>> = new Map<string, Pair<K, V>>(this.project);

    m.delete(key.hashCode());

    return ImmutableProject.ofInternal<K, V>(m);
  }

  public isEmpty(): boolean {
    if (this === ImmutableProject.empty<K, V>()) {
      return true;
    }

    return super.isEmpty();
  }

  public map<W extends Nominative>(mapper: Mapper<V, W>): ImmutableProject<K, W> {
    const m: Map<string, Pair<K, W>> = this.mapInternal<W>(mapper);

    return ImmutableProject.ofInternal<K, W>(m);
  }

  public duplicate(): ImmutableProject<K, V> {
    if (this.isEmpty()) {
      return ImmutableProject.empty<K, V>();
    }

    const m: Map<string, Pair<K, V>> = new Map<string, Pair<K, V>>(this.project);

    return ImmutableProject.ofInternal<K, V>(m);
  }
}
