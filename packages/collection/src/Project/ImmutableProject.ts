import { AnonymousNominative, Nominative } from '@jamashita/publikum-interface';
import { Pair } from '../Pair';
import { AProject } from './Abstract/AProject';

export class ImmutableProject<K extends Nominative<K>, V extends Nominative<V>> extends AProject<K, V, 'ImmutableProject'> {
  public readonly noun: 'ImmutableProject' = 'ImmutableProject';

  private static readonly EMPTY: ImmutableProject<AnonymousNominative, AnonymousNominative> = new ImmutableProject<AnonymousNominative,
    AnonymousNominative>(new Map<string, Pair<AnonymousNominative, AnonymousNominative>>());

  public static of<KT extends Nominative<KT>, VT extends Nominative<VT>>(elements: Map<KT, VT>): ImmutableProject<KT, VT> {
    if (elements.size === 0) {
      return ImmutableProject.empty<KT, VT>();
    }

    const map: Map<string, Pair<KT, VT>> = new Map<string, Pair<KT, VT>>();

    elements.forEach((v: VT, k: KT) => {
      map.set(k.hashCode(), Pair.of(k, v));
    });

    return ImmutableProject.ofMap<KT, VT>(map);
  }

  private static ofMap<KT extends Nominative<KT>, VT extends Nominative<VT>>(elements: Map<string, Pair<KT, VT>>): ImmutableProject<KT, VT> {
    if (elements.size === 0) {
      return ImmutableProject.empty<KT, VT>();
    }

    return new ImmutableProject<KT, VT>(elements);
  }

  public static empty<KT extends Nominative<KT>, VT extends Nominative<VT>>(): ImmutableProject<KT, VT> {
    return ImmutableProject.EMPTY as ImmutableProject<KT, VT>;
  }

  protected constructor(elements: Map<string, Pair<K, V>>) {
    super(elements);
  }

  public set(key: K, value: V): ImmutableProject<K, V> {
    const map: Map<string, Pair<K, V>> = new Map<string, Pair<K, V>>(this.elements);

    map.set(key.hashCode(), Pair.of(key, value));

    return ImmutableProject.ofMap<K, V>(map);
  }

  public remove(key: K): ImmutableProject<K, V> {
    if (this.isEmpty()) {
      return this;
    }

    const map: Map<string, Pair<K, V>> = new Map<string, Pair<K, V>>(this.elements);

    const deleted: boolean = map.delete(key.hashCode());

    if (deleted) {
      return ImmutableProject.ofMap<K, V>(map);
    }

    return this;
  }

  public isEmpty(): boolean {
    if (this === ImmutableProject.empty<K, V>()) {
      return true;
    }

    return super.isEmpty();
  }

  public duplicate(): ImmutableProject<K, V> {
    if (this.isEmpty()) {
      return ImmutableProject.empty<K, V>();
    }

    const map: Map<string, Pair<K, V>> = new Map<string, Pair<K, V>>(this.elements);

    return ImmutableProject.ofMap<K, V>(map);
  }
}
