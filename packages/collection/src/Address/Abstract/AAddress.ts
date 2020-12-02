import { isNominative } from '@jamashita/publikum-interface';
import { Objet } from '@jamashita/publikum-object';
import { BinaryPredicate, Enumerator, Mapper, Nullable } from '@jamashita/publikum-type';
import { Quantity } from '../../Quantity';
import { Address } from '../Interface/Address';

export abstract class AAddress<V, T extends AAddress<V, T>, N extends string = string> extends Quantity<void, V, N> implements Address<V, N> {
  protected readonly address: Map<unknown, V>;

  protected constructor(address: Map<unknown, V>) {
    super();
    this.address = address;
  }

  protected abstract forge(self: Map<unknown, V>): T;

  public abstract add(value: V): Address<V, N>;

  public abstract remove(value: V): Address<V, N>;

  public abstract map<W>(mapper: Mapper<V, W>): Address<W>;

  public abstract duplicate(): Address<V, N>;

  public iterator(): Iterator<[void, V]> {
    const iterator: IterableIterator<V> = this.address.values();
    const iterable: Array<[void, V]> = [];

    let res: IteratorResult<V> = iterator.next();

    while (res.done !== true) {
      iterable.push([undefined, res.value]);

      res = iterator.next();
    }

    return iterable.values();
  }

  public get(): Nullable<V> {
    return null;
  }

  public contains(value: V): boolean {
    if (isNominative(value)) {
      return this.address.has(value.hashCode());
    }

    return this.address.has(value);
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

  public forEach(iteration: Enumerator<void, V>): void {
    this.address.forEach((v: V) => {
      iteration(v, undefined);
    });
  }

  public find(predicate: BinaryPredicate<V, void>): Nullable<V> {
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
      properties.push(Objet.identify(element));
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

  public filter(predicate: BinaryPredicate<V, void>): T {
    const m: Map<unknown, V> = new Map<unknown, V>();

    this.address.forEach((v: V) => {
      if (predicate(v, undefined)) {
        if (isNominative(v)) {
          m.set(v.hashCode(), v);

          return;
        }

        m.set(v, v);
      }
    });

    return this.forge(m);
  }

  protected mapInternal<W>(mapper: Mapper<V, W>): Map<unknown, W> {
    const m: Map<unknown, W> = new Map<unknown, W>();
    let i: number = 0;

    this.address.forEach((v: V) => {
      if (isNominative(v)) {
        m.set(v.hashCode(), mapper(v, i));
        i++;

        return;
      }

      m.set(v, mapper(v, i));
      i++;
    });

    return m;
  }
}
