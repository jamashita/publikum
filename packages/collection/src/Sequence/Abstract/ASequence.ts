import { Nominative } from '@jamashita/publikum-interface';
import {
  Ambiguous,
  BinaryPredicate,
  Enumerator,
  Kind,
  Mapper,
  Nullable,
  Peek,
  Predicate
} from '@jamashita/publikum-type';
import { CancellableEnumerator } from '../../Interface/CancellableEnumerator';
import { Pair } from '../../Pair';
import { Quantity } from '../../Quantity';
import { Sequence } from '../Interface/Sequence';

export abstract class ASequence<V extends Nominative, N extends string = string> extends Quantity<number, V, N> implements Sequence<V, N> {
  public abstract readonly noun: N;
  protected elements: Array<V>;

  protected constructor(elements: Array<V>) {
    super();
    this.elements = elements;
  }

  public abstract add(value: V): Sequence<V, N>;

  public abstract set(key: number, value: V): Sequence<V>;

  public abstract remove(key: number): Sequence<V>;

  public abstract map<W extends Nominative>(mapper: Mapper<V, W>): Sequence<W, N>;

  public abstract filter(iterator: Enumerator<number, V>): Sequence<V, N>;

  public abstract duplicate(): Sequence<V, N>;

  public [Symbol.iterator](): Iterator<Pair<number, V>> {
    return this.elements.map<Pair<number, V>>((e: V, index: number) => {
      return Pair.of(index, e);
    })[Symbol.iterator]();
  }

  public get(key: number): Nullable<V> {
    const element: Ambiguous<V> = this.elements[key];

    if (Kind.isUndefined(element)) {
      return null;
    }

    return element;
  }

  public contains(value: V): boolean {
    const found: Ambiguous<V> = this.elements.find((element: V) => {
      return value.equals(element);
    });

    return !Kind.isUndefined(found);
  }

  public size(): number {
    return this.elements.length;
  }

  public isEmpty(): boolean {
    if (this.size() === 0) {
      return true;
    }

    return false;
  }

  public forEach(iteration: CancellableEnumerator<number, V>): void {
    let done: boolean = false;
    const cancel: Peek = () => {
      done = true;
    };

    for (let i: number = 0; i < this.elements.length; i++) {
      iteration(this.elements[i], i, cancel);

      if (done) {
        return;
      }
    }
  }

  public find(predicate: Predicate<V>): Nullable<V> {
    const element: Ambiguous<V> = this.elements.find(predicate);

    if (Kind.isUndefined(element)) {
      return null;
    }

    return element;
  }

  public every(predicate: BinaryPredicate<V, number>): boolean {
    return this.elements.every(predicate);
  }

  public some(predicate: BinaryPredicate<V, number>): boolean {
    return this.elements.some(predicate);
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof ASequence)) {
      return false;
    }
    if (this.size() !== other.size()) {
      return false;
    }

    const thisIterator: Iterator<Pair<number, V>> = this[Symbol.iterator]();
    const otherIterator: Iterator<Pair<number, unknown>> = other[Symbol.iterator]();
    let thisRes: IteratorResult<Pair<number, V>> = thisIterator.next();
    let otherRes: IteratorResult<Pair<number, unknown>> = otherIterator.next();

    while (thisRes.done !== true && otherRes.done !== true) {
      if (!thisRes.value.getValue().equals(otherRes.value.getValue())) {
        return false;
      }

      thisRes = thisIterator.next();
      otherRes = otherIterator.next();

      if (thisRes.done === true && otherRes.done === true) {
        return true;
      }
    }

    return false;
  }

  public toArray(): Array<V> {
    return [...this.elements];
  }

  public serialize(): string {
    return this.elements.map<string>((element: V) => {
      return element.toString();
    }).join(', ');
  }

  public values(): Iterable<V> {
    return this.toArray();
  }
}
