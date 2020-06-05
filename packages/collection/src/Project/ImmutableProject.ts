import { Nominative } from '@jamashita/publikum-interface';
import { Objet } from '@jamashita/publikum-object';

import { AProject } from './Abstract/AProject';
import { Project } from './Interface/Project';

export class ImmutableProject<K extends Nominative<K>, V extends Nominative<V>> extends AProject<K, V>
  implements Project<K, V> {
  public readonly noun: 'ImmutableProject' = 'ImmutableProject';

  private static readonly EMPTY: ImmutableProject<Objet, Objet> = new ImmutableProject<Objet, Objet>(
    new Map<string, [Objet, Objet]>()
  );

  public static of<K extends Nominative<K>, V extends Nominative<V>>(elements: Map<K, V>): ImmutableProject<K, V> {
    if (elements.size === 0) {
      return ImmutableProject.empty<K, V>();
    }

    const map: Map<string, [K, V]> = new Map<string, [K, V]>();

    elements.forEach((v: V, k: K) => {
      map.set(k.hashCode(), [k, v]);
    });

    return ImmutableProject.ofMap<K, V>(map);
  }

  private static ofMap<K extends Nominative<K>, V extends Nominative<V>>(
    elements: Map<string, [K, V]>
  ): ImmutableProject<K, V> {
    if (elements.size === 0) {
      return ImmutableProject.empty<K, V>();
    }

    return new ImmutableProject<K, V>(elements);
  }

  public static empty<K extends Nominative<K>, V extends Nominative<V>>(): ImmutableProject<K, V> {
    return ImmutableProject.EMPTY as ImmutableProject<K, V>;
  }

  protected constructor(elements: Map<string, [K, V]>) {
    super(elements);
  }

  public set(key: K, value: V): ImmutableProject<K, V> {
    const map: Map<string, [K, V]> = new Map<string, [K, V]>(this.elements);

    map.set(key.hashCode(), [key, value]);

    return ImmutableProject.ofMap<K, V>(map);
  }

  public remove(key: K): ImmutableProject<K, V> {
    if (this.isEmpty()) {
      return this;
    }

    const map: Map<string, [K, V]> = new Map<string, [K, V]>(this.elements);

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

    const map: Map<string, [K, V]> = new Map<string, [K, V]>(this.elements);

    return ImmutableProject.ofMap<K, V>(map);
  }
}
