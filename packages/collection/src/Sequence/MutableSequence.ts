import { Nominative } from '@jamashita/publikum-interface';
import { Enumerator, Kind, Mapper } from '@jamashita/publikum-type';
import { ASequence } from './Abstract/ASequence';
import { ReadonlySequence } from './Interface/ReadonlySequence';

export class MutableSequence<V extends Nominative> extends ASequence<V, 'MutableSequence'> {
  public readonly noun: 'MutableSequence' = 'MutableSequence';

  public static of<VT extends Nominative>(sequence: ReadonlySequence<VT>): MutableSequence<VT> {
    return MutableSequence.ofArray<VT>(sequence.toArray());
  }

  public static ofArray<VT extends Nominative>(array: ReadonlyArray<VT>): MutableSequence<VT> {
    return new MutableSequence<VT>(array);
  }

  public static empty<VT extends Nominative>(): MutableSequence<VT> {
    return MutableSequence.ofArray<VT>([]);
  }

  protected constructor(sequence: ReadonlyArray<V>) {
    super(sequence);
  }

  public set(key: number, value: V): MutableSequence<V> {
    if (key < 0) {
      return this;
    }
    if (key >= this.sequence.length) {
      return this;
    }
    if (!Kind.isInteger(key)) {
      return this;
    }

    this.sequence = [...this.sequence.slice(0, key), value, ...this.sequence.slice(key + 1)];

    return this;
  }

  public remove(key: number): MutableSequence<V> {
    if (key < 0) {
      return this;
    }
    if (key >= this.sequence.length) {
      return this;
    }
    if (!Kind.isInteger(key)) {
      return this;
    }

    this.sequence = [...this.sequence.slice(0, key), ...this.sequence.slice(key + 1)];

    return this;
  }

  public add(value: V): MutableSequence<V> {
    this.sequence.push(value);

    return this;
  }

  public map<W extends Nominative>(mapper: Mapper<V, W>): MutableSequence<W> {
    return MutableSequence.ofArray<W>(this.sequence.map<W>(mapper));
  }

  public filter(iterator: Enumerator<number, V>): MutableSequence<V> {
    return MutableSequence.ofArray<V>(this.sequence.filter(iterator));
  }

  public duplicate(): MutableSequence<V> {
    return MutableSequence.ofArray<V>([...this.sequence]);
  }
}
