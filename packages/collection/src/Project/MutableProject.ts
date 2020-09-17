import { Nominative } from '@jamashita/publikum-interface';
import { Pair } from '../Pair';
import { AProject } from './Abstract/AProject';

export class MutableProject<K extends Nominative<K>, V extends Nominative<V>> extends AProject<K, V, 'MutableProject'> {
  public readonly noun: 'MutableProject' = 'MutableProject';

  public static of<KT extends Nominative<KT>, VT extends Nominative<VT>>(elements: ReadonlyMap<KT, VT>): MutableProject<KT, VT> {
    if (elements.size === 0) {
      return MutableProject.empty<KT, VT>();
    }

    const map: Map<string, Pair<KT, VT>> = new Map<string, Pair<KT, VT>>();

    elements.forEach((v: VT, k: KT) => {
      map.set(k.hashCode(), Pair.of(k, v));
    });

    return MutableProject.ofMap<KT, VT>(map);
  }

  private static ofMap<KT extends Nominative<KT>, VT extends Nominative<VT>>(elements: Map<string, Pair<KT, VT>>): MutableProject<KT, VT> {
    return new MutableProject<KT, VT>(elements);
  }

  public static empty<KT extends Nominative<KT>, VT extends Nominative<VT>>(): MutableProject<KT, VT> {
    return new MutableProject<KT, VT>(new Map<string, Pair<KT, VT>>());
  }

  protected constructor(elements: Map<string, Pair<K, V>>) {
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

    this.elements.delete(key.hashCode());

    return this;
  }

  public isEmpty(): boolean {
    return super.isEmpty();
  }

  public duplicate(): MutableProject<K, V> {
    return MutableProject.ofMap<K, V>(new Map<string, Pair<K, V>>(this.elements));
  }
}
