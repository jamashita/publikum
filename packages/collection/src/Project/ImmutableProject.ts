import { Nominative, NonNominative } from '@jamashita/publikum-interface';

import { Pair } from '../Pair';
import { AProject } from './Abstract/AProject';

export class ImmutableProject<K extends Nominative<K>, V extends Nominative<V>> extends AProject<
  K,
  V,
  'ImmutableProject'
> {
  public readonly noun: 'ImmutableProject' = 'ImmutableProject';

  private static readonly EMPTY: ImmutableProject<NonNominative, NonNominative> = new ImmutableProject<
    NonNominative,
    NonNominative
  >(new Map<string, Pair<NonNominative, NonNominative>>());

  public static of<K extends Nominative<K>, V extends Nominative<V>>(elements: Map<K, V>): ImmutableProject<K, V> {
    if (elements.size === 0) {
      return ImmutableProject.empty<K, V>();
    }

    const map: Map<string, Pair<K, V>> = new Map<string, Pair<K, V>>();

    elements.forEach((v: V, k: K) => {
      map.set(k.hashCode(), Pair.of(k, v));
    });

    return ImmutableProject.ofMap<K, V>(map);
  }

  private static ofMap<K extends Nominative<K>, V extends Nominative<V>>(
    elements: Map<string, Pair<K, V>>
  ): ImmutableProject<K, V> {
    if (elements.size === 0) {
      return ImmutableProject.empty<K, V>();
    }

    return new ImmutableProject<K, V>(elements);
  }

  public static empty<K extends Nominative<K>, V extends Nominative<V>>(): ImmutableProject<K, V> {
    return ImmutableProject.EMPTY as ImmutableProject<K, V>;
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
