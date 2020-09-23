import { Nominative } from '@jamashita/publikum-interface';
import { Ambiguous, BinaryPredicate, Kind, Mapper, Nullable, Peek } from '@jamashita/publikum-type';
import { CancellableEnumerator } from '../../Interface/CancellableEnumerator';
import { Pair } from '../../Pair';
import { Quantity } from '../../Quantity';
import { Project } from '../Interface/Project';

export abstract class AProject<K extends Nominative, V extends Nominative, N extends string = string> extends Quantity<K, V, N> implements Project<K, V, N> {
  public abstract readonly noun: N;
  protected readonly elements: Map<string, Pair<K, V>>;

  protected constructor(elements: Map<string, Pair<K, V>>) {
    super();
    this.elements = elements;
  }

  public abstract duplicate(): Project<K, V, N>;

  public abstract set(key: K, value: V): Project<K, V, N>;

  public abstract remove(key: K): Project<K, V, N>;

  public abstract map<W extends Nominative>(mapper: Mapper<V, W>): Project<K, W>;

  public [Symbol.iterator](): Iterator<Pair<K, V>> {
    return this.elements.values();
  }


  public get(key: K): Nullable<V> {
    const element: Ambiguous<Pair<K, V>> = this.elements.get(key.hashCode());

    if (Kind.isUndefined(element)) {
      return null;
    }

    return element.getValue();
  }

  public has(key: K): boolean {
    return this.elements.has(key.hashCode());
  }

  // FIXME O(n)
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

  public forEach(iteration: CancellableEnumerator<K, V>): void {
    let done: boolean = false;
    const cancel: Peek = () => {
      done = true;
    };

    for (const [, p] of this.elements) {
      iteration(p.getValue(), p.getKey(), cancel);

      if (done) {
        return;
      }
    }
  }

  public every(predicate: BinaryPredicate<V, K>): boolean {
    for (const [, pair] of this.elements) {
      if (!predicate(pair.getValue(), pair.getKey())) {
        return false;
      }
    }

    return true;
  }

  public some(predicate: BinaryPredicate<V, K>): boolean {
    for (const [, pair] of this.elements) {
      if (predicate(pair.getValue(), pair.getKey())) {
        return true;
      }
    }

    return false;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof AProject)) {
      return false;
    }
    if (this.size() !== other.size()) {
      return false;
    }

    return this.every((value: V, key: K) => {
      const v: Nullable<unknown> = other.get(key);

      if (!Kind.isNull(v)) {
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

  public keys(): Iterable<K> {
    const iterator: IterableIterator<Pair<K, V>> = this.elements.values();
    const iterable: Array<K> = [];

    let res: IteratorResult<Pair<K, V>> = iterator.next();

    while (res.done !== true) {
      iterable.push(res.value.getKey());

      res = iterator.next();
    }

    return iterable;
  }

  public values(): Iterable<V> {
    const iterator: IterableIterator<Pair<K, V>> = this.elements.values();
    const iterable: Array<V> = [];

    let res: IteratorResult<Pair<K, V>> = iterator.next();

    while (res.done !== true) {
      iterable.push(res.value.getValue());

      res = iterator.next();
    }

    return iterable;
  }
}
