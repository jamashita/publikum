import { Nominative } from '@jamashita/publikum-interface';
import { BinaryPredicate, Mapper, Nullable, Peek, Predicate } from '@jamashita/publikum-type';
import { CancellableEnumerator } from '../../Interface/CancellableEnumerator';
import { Pair } from '../../Pair';
import { Quantity } from '../../Quantity';
import { Address } from '../Interface/Address';

export abstract class AAddress<V extends Nominative, N extends string = string> extends Quantity<void, V, N> implements Address<V, N> {
  public abstract readonly noun: N;
  protected readonly address: Map<string, V>;

  protected constructor(address: ReadonlyMap<string, V>) {
    super();
    this.address = new Map<string, V>(address);
  }

  public abstract duplicate(): Address<V, N>;

  public abstract add(value: V): Address<V, N>;

  public abstract remove(value: V): Address<V, N>;

  public abstract map<W extends Nominative>(mapper: Mapper<V, W>): Address<W>;

  public [Symbol.iterator](): Iterator<Pair<void, V>> {
    const iterator: IterableIterator<V> = this.address.values();
    const iterable: Array<Pair<void, V>> = [];

    let res: IteratorResult<V> = iterator.next();

    while (res.done !== true) {
      iterable.push(Pair.of(undefined, res.value));

      res = iterator.next();
    }

    return iterable[Symbol.iterator]();
  }

  public get(): Nullable<V> {
    return null;
  }

  public contains(value: V): boolean {
    return this.address.has(value.hashCode());
  }

  public size(): number {
    return this.address.size;
  }

  public isEmpty(): boolean {
    if (this.size() === 0) {
      return true;
    }

    return false;
  }

  public forEach(iteration: CancellableEnumerator<void, V>): void {
    let done: boolean = false;
    const cancel: Peek = () => {
      done = true;
    };

    for (const [, v] of this.address) {
      iteration(v, undefined, cancel);

      if (done) {
        return;
      }
    }
  }

  public find(predicate: Predicate<V>): Nullable<V> {
    for (const [, v] of this.address) {
      if (predicate(v)) {
        return v;
      }
    }

    return null;
  }

  public every(predicate: BinaryPredicate<V, void>): boolean {
    for (const [, v] of this.address) {
      if (!predicate(v)) {
        return false;
      }
    }

    return true;
  }

  public some(predicate: BinaryPredicate<V, void>): boolean {
    for (const [, v] of this.address) {
      if (predicate(v)) {
        return true;
      }
    }

    return false;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof AAddress)) {
      return false;
    }
    if (this.size() !== other.size()) {
      return false;
    }

    return this.every((value: V) => {
      return other.contains(value);
    });
  }

  public toSet(): Set<V> {
    return new Set<V>(this.address.values());
  }

  public serialize(): string {
    const properties: Array<string> = [];

    this.forEach((element: V) => {
      properties.push(element.toString());
    });

    return properties.join(', ');
  }

  public values(): Iterable<V> {
    const iterator: IterableIterator<V> = this.address.values();
    const iterable: Array<V> = [];

    let res: IteratorResult<V> = iterator.next();

    while (res.done !== true) {
      iterable.push(res.value);

      res = iterator.next();
    }

    return iterable;
  }
}
