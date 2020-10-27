import { Nominative } from '@jamashita/publikum-interface';
import { Ambiguous, BinaryPredicate, Kind, Mapper, Nullable, Peek } from '@jamashita/publikum-type';
import { CancellableEnumerator } from '../../Interface/CancellableEnumerator';
import { Pair } from '../../Pair';
import { Quantity } from '../../Quantity';
import { Sequence } from '../Interface/Sequence';

export abstract class ASequence<V extends Nominative, N extends string = string> extends Quantity<number, V, N> implements Sequence<V, N> {
  protected sequence: Array<V>;

  protected constructor(sequence: ReadonlyArray<V>) {
    super();
    this.sequence = [...sequence];
  }

  public abstract add(value: V): Sequence<V, N>;

  public abstract set(key: number, value: V): Sequence<V>;

  public abstract remove(key: number): Sequence<V>;

  public abstract map<W extends Nominative>(mapper: Mapper<V, W>): Sequence<W, N>;

  public abstract filter(predicate: BinaryPredicate<V, number>): Sequence<V, N>;

  public abstract duplicate(): Sequence<V, N>;

  public [Symbol.iterator](): Iterator<Pair<number, V>> {
    return this.sequence.map<Pair<number, V>>((e: V, index: number) => {
      return Pair.of(index, e);
    })[Symbol.iterator]();
  }

  public get(key: number): Nullable<V> {
    const v: Ambiguous<V> = this.sequence[key];

    if (Kind.isUndefined(v)) {
      return null;
    }

    return v;
  }

  public contains(value: V): boolean {
    const found: Ambiguous<V> = this.sequence.find((v: V) => {
      return v.equals(value);
    });

    return !Kind.isUndefined(found);
  }

  public size(): number {
    return this.sequence.length;
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

    for (let i: number = 0; i < this.sequence.length; i++) {
      iteration(this.sequence[i], i, cancel);

      if (done) {
        return;
      }
    }
  }

  public find(predicate: BinaryPredicate<V, number>): Nullable<V> {
    const found: Ambiguous<V> = this.sequence.find(predicate);

    if (Kind.isUndefined(found)) {
      return null;
    }

    return found;
  }

  public every(predicate: BinaryPredicate<V, number>): boolean {
    return this.sequence.every(predicate);
  }

  public some(predicate: BinaryPredicate<V, number>): boolean {
    return this.sequence.some(predicate);
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
    return [...this.sequence];
  }

  public serialize(): string {
    return this.sequence.map<string>((v: V) => {
      return v.toString();
    }).join(', ');
  }

  public values(): Iterable<V> {
    return this.toArray();
  }
}
