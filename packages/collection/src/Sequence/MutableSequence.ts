import { BinaryFunction, BinaryPredicate, Kind, Mapper } from '@jamashita/publikum-type';
import { ASequence } from './Abstract/ASequence';
import { ReadonlySequence } from './Interface/ReadonlySequence';

export class MutableSequence<V> extends ASequence<V, 'MutableSequence'> {
  public readonly noun: 'MutableSequence' = 'MutableSequence';

  public static of<VT>(sequence: ReadonlySequence<VT>): MutableSequence<VT> {
    return MutableSequence.ofInternal<VT>(sequence.toArray());
  }

  public static ofArray<VT>(array: ReadonlyArray<VT>): MutableSequence<VT> {
    return MutableSequence.ofInternal<VT>([...array]);
  }

  private static ofInternal<VT>(array: Array<VT>): MutableSequence<VT> {
    return new MutableSequence<VT>(array);
  }

  public static empty<VT>(): MutableSequence<VT> {
    return MutableSequence.ofArray<VT>([]);
  }

  protected constructor(sequence: Array<V>) {
    super(sequence);
  }

  public set(key: number, value: V): MutableSequence<V> {
    if (!Kind.isInteger(key)) {
      return this;
    }
    if (key < 0 || this.sequence.length <= key) {
      return this;
    }

    this.sequence = [...this.sequence.slice(0, key), value, ...this.sequence.slice(key + 1)];

    return this;
  }

  public remove(key: number): MutableSequence<V> {
    if (!Kind.isInteger(key)) {
      return this;
    }
    if (key < 0 || this.sequence.length <= key) {
      return this;
    }

    this.sequence = [...this.sequence.slice(0, key), ...this.sequence.slice(key + 1)];

    return this;
  }

  public add(value: V): MutableSequence<V> {
    this.sequence.push(value);

    return this;
  }

  public map<W>(mapper: Mapper<V, W>): MutableSequence<W> {
    return MutableSequence.ofArray<W>(this.sequence.map<W>(mapper));
  }

  public filter(predicate: BinaryPredicate<V, number>): MutableSequence<V> {
    return MutableSequence.ofArray<V>(this.sequence.filter(predicate));
  }

  public sort(comparator: BinaryFunction<V, V, number>): MutableSequence<V> {
    const arr: Array<V> = [...this.sequence];

    arr.sort(comparator);

    return MutableSequence.ofArray<V>(arr);
  }

  public duplicate(): MutableSequence<V> {
    return MutableSequence.ofArray<V>([...this.sequence]);
  }
}
