import { isNominative } from '@jamashita/publikum-interface';
import { Mapper } from '@jamashita/publikum-type';
import { Collection } from '../Interface/Collection';
import { AProject } from './Abstract/AProject';

export class ImmutableProject<K, V> extends AProject<K, V, ImmutableProject<K, V>, 'ImmutableProject'> {
  public readonly noun: 'ImmutableProject' = 'ImmutableProject';

  private static readonly EMPTY: ImmutableProject<unknown, unknown> = new ImmutableProject<unknown, unknown>(new Map<unknown, [unknown, unknown]>());

  public static of<KT, VT>(collection: Collection<KT, VT>): ImmutableProject<KT, VT> {
    const map: Map<KT, VT> = new Map<KT, VT>(collection);

    return ImmutableProject.ofMap<KT, VT>(map);
  }

  public static ofMap<KT, VT>(map: ReadonlyMap<KT, VT>): ImmutableProject<KT, VT> {
    const m: Map<KT | string, [KT, VT]> = new Map<KT | string, [KT, VT]>();

    map.forEach((v: VT, k: KT) => {
      if (isNominative(k)) {
        m.set(k.hashCode(), [k, v]);

        return;
      }

      m.set(k, [k, v]);
    });

    return ImmutableProject.ofInternal<KT, VT>(m);
  }

  private static ofInternal<KT, VT>(project: Map<KT | string, [KT, VT]>): ImmutableProject<KT, VT> {
    if (project.size === 0) {
      return ImmutableProject.empty<KT, VT>();
    }

    return new ImmutableProject<KT, VT>(project);
  }

  public static empty<KT, VT>(): ImmutableProject<KT, VT> {
    return ImmutableProject.EMPTY as ImmutableProject<KT, VT>;
  }

  protected constructor(project: Map<K | string, [K, V]>) {
    super(project);
  }

  protected forge(self: Map<K | string, [K, V]>): ImmutableProject<K, V> {
    return ImmutableProject.ofInternal<K, V>(self);
  }

  public set(key: K, value: V): ImmutableProject<K, V> {
    const m: Map<K | string, [K, V]> = new Map<K | string, [K, V]>(this.project);
    const k: K | string = this.hashor<K>(key);

    m.set(k, [key, value]);

    return ImmutableProject.ofInternal<K, V>(m);
  }

  public remove(key: K): ImmutableProject<K, V> {
    if (this.isEmpty()) {
      return this;
    }
    if (!this.has(key)) {
      return this;
    }

    const m: Map<K | string, [K, V]> = new Map<K | string, [K, V]>(this.project);
    const k: K | string = this.hashor<K>(key);

    m.delete(k);

    return ImmutableProject.ofInternal<K, V>(m);
  }

  public isEmpty(): boolean {
    if (this === ImmutableProject.empty<K, V>()) {
      return true;
    }

    return super.isEmpty();
  }

  public map<W>(mapper: Mapper<V, W>): ImmutableProject<K, W> {
    const m: Map<K | string, [K, W]> = this.mapInternal<W>(mapper);

    return ImmutableProject.ofInternal<K, W>(m);
  }

  public duplicate(): ImmutableProject<K, V> {
    if (this.isEmpty()) {
      return ImmutableProject.empty<K, V>();
    }

    return ImmutableProject.ofInternal<K, V>(new Map<K | string, [K, V]>(this.project));
  }
}
