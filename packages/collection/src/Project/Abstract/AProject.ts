import { Nominative } from '@jamashita/publikum-interface';
import { Ambiguous, BinaryPredicate, Enumerator, Nullable } from '@jamashita/publikum-type';

import { Pair } from '../../Pair';
import { Quantity } from '../../Quantity';
import { Project } from '../Interface/Project';

export abstract class AProject<K extends Nominative<K>, V extends Nominative<V>, N extends string = string>
  extends Quantity<Project<K, V, N>, K, V, N>
  implements Project<K, V, N> {
  public abstract readonly noun: N;
  protected readonly elements: Map<string, Pair<K, V>>;

  protected constructor(elements: Map<string, Pair<K, V>>) {
    super();
    this.elements = elements;
  }

  public abstract set(key: K, value: V): Project<K, V, N>;

  public abstract remove(key: K): Project<K, V, N>;

  public abstract duplicate(): Project<K, V, N>;

  public get(key: K): Nullable<V> {
    const element: Ambiguous<Pair<K, V>> = this.elements.get(key.hashCode());

    if (element === undefined) {
      return null;
    }

    return element.getValue();
  }

  public has(key: K): boolean {
    return this.elements.has(key.hashCode());
  }

  // FIXME ORDER N
  public contains(value: V): boolean {
    for (const [, pair] of this.elements) {
      if (value.equals(pair.getValue())) {
        return true;
      }
    }

    return false;
  }

  public size(): number {
    return this.elements.size;
  }

  public isEmpty(): boolean {
    if (this.size() === 0) {
      return true;
    }

    return false;
  }

  public iterator(): Iterator<Pair<K, V>> {
    return this.elements.values()[Symbol.iterator]();
  }

  public forEach(iteration: Enumerator<K, V>): void {
    this.elements.forEach((element: Pair<K, V>) => {
      iteration(element.getValue(), element.getKey());
    });
  }

  public every(predicate: BinaryPredicate<K, V>): boolean {
    for (const [, pair] of this.elements) {
      if (!predicate(pair.getKey(), pair.getValue())) {
        return false;
      }
    }

    return true;
  }

  public some(predicate: BinaryPredicate<K, V>): boolean {
    for (const [, pair] of this.elements) {
      if (predicate(pair.getKey(), pair.getValue())) {
        return true;
      }
    }

    return false;
  }

  public equals(other: Project<K, V, N>): boolean {
    if (this === other) {
      return true;
    }
    if (this.size() !== other.size()) {
      return false;
    }

    return this.every((key: K, value: V) => {
      const v: Nullable<V> = other.get(key);

      if (v !== null) {
        if (value.equals(v)) {
          return true;
        }
      }

      return false;
    });
  }

  public toMap(): Map<K, V> {
    const map: Map<K, V> = new Map<K, V>();

    this.forEach((value: V, key: K) => {
      map.set(key, value);
    });

    return map;
  }

  public serialize(): string {
    const properties: Array<string> = [];

    this.forEach((value: V, key: K) => {
      properties.push(`{${key.toString()}: ${value.toString()}}`);
    });

    return properties.join(', ');
  }
}
