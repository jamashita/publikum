import { Nominative } from '@jamashita/publikum-interface';
import { Ambiguous, BinaryPredicate, Kind, Mapper, Nullable, Peek } from '@jamashita/publikum-type';
import { CancellableEnumerator } from '../../Interface/CancellableEnumerator';
import { Pair } from '../../Pair';
import { Quantity } from '../../Quantity';
import { Project } from '../Interface/Project';

export abstract class AProject<K extends Nominative, V extends Nominative, T extends AProject<K, V, T>, N extends string = string> extends Quantity<K, V, N> implements Project<K, V, N> {
  public abstract readonly noun: N;
  protected readonly project: Map<string, Pair<K, V>>;

  protected constructor(project: ReadonlyMap<string, Pair<K, V>>) {
    super();
    this.project = new Map<string, Pair<K, V>>(project);
  }

  protected abstract forge(self: Map<string, Pair<K, V>>): T;

  public abstract set(key: K, value: V): Project<K, V, N>;

  public abstract remove(key: K): Project<K, V, N>;

  public abstract map<W extends Nominative>(mapper: Mapper<V, W>): Project<K, W>;

  public filter(predicate: BinaryPredicate<V, K>): T {
    const m: Map<string, Pair<K, V>> = new Map<string, Pair<K, V>>();

    for (const [, p] of this.project) {
      if (predicate(p.getValue(), p.getKey())) {
        m.set(p.getKey().hashCode(), p);
      }
    }

    return this.forge(m);
  }

  public abstract duplicate(): Project<K, V, N>;

  public [Symbol.iterator](): Iterator<Pair<K, V>> {
    return this.project.values();
  }

  public get(key: K): Nullable<V> {
    const p: Ambiguous<Pair<K, V>> = this.project.get(key.hashCode());

    if (Kind.isUndefined(p)) {
      return null;
    }

    return p.getValue();
  }

  public has(key: K): boolean {
    return this.project.has(key.hashCode());
  }

  // FIXME O(n)
  public contains(value: V): boolean {
    for (const [, p] of this.project) {
      if (value.equals(p.getValue())) {
        return true;
      }
    }

    return false;
  }

  public size(): number {
    return this.project.size;
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

    for (const [, p] of this.project) {
      iteration(p.getValue(), p.getKey(), cancel);

      if (done) {
        return;
      }
    }
  }

  public every(predicate: BinaryPredicate<V, K>): boolean {
    for (const [, p] of this.project) {
      if (!predicate(p.getValue(), p.getKey())) {
        return false;
      }
    }

    return true;
  }

  public some(predicate: BinaryPredicate<V, K>): boolean {
    for (const [, p] of this.project) {
      if (predicate(p.getValue(), p.getKey())) {
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

    return this.every((v: V, k: K) => {
      const value: Nullable<unknown> = other.get(k);

      if (!Kind.isNull(value)) {
        if (v.equals(value)) {
          return true;
        }
      }

      return false;
    });
  }

  public toMap(): Map<K, V> {
    const map: Map<K, V> = new Map<K, V>();

    this.forEach((v: V, k: K) => {
      map.set(k, v);
    });

    return map;
  }

  public serialize(): string {
    const properties: Array<string> = [];

    this.forEach((v: V, k: K) => {
      properties.push(`{${k.toString()}: ${v.toString()}}`);
    });

    return properties.join(', ');
  }

  public keys(): Iterable<K> {
    const iterator: IterableIterator<Pair<K, V>> = this.project.values();
    const iterable: Array<K> = [];

    let res: IteratorResult<Pair<K, V>> = iterator.next();

    while (res.done !== true) {
      iterable.push(res.value.getKey());

      res = iterator.next();
    }

    return iterable;
  }

  public values(): Iterable<V> {
    const iterator: IterableIterator<Pair<K, V>> = this.project.values();
    const iterable: Array<V> = [];

    let res: IteratorResult<Pair<K, V>> = iterator.next();

    while (res.done !== true) {
      iterable.push(res.value.getValue());

      res = iterator.next();
    }

    return iterable;
  }

  public find(predicate: BinaryPredicate<V, K>): Nullable<V> {
    for (const [, p] of this.project) {
      if (predicate(p.getValue(), p.getKey())) {
        return p.getValue();
      }
    }

    return null;
  }

  protected mapInternal<W extends Nominative>(mapper: Mapper<V, W>): Map<string, Pair<K, W>> {
    const m: Map<string, Pair<K, W>> = new Map<string, Pair<K, W>>();
    let i: number = 0;

    this.project.forEach((p: Pair<K, V>) => {
      m.set(p.getKey().hashCode(), Pair.of<K, W>(p.getKey(), mapper(p.getValue(), i)));
      i++;
    });

    return m;
  }
}


