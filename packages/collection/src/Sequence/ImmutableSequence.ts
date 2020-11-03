import { Nominative } from '@jamashita/publikum-interface';
import { BinaryPredicate, Kind, Mapper } from '@jamashita/publikum-type';
import { ASequence } from './Abstract/ASequence';
import { ReadonlySequence } from './Interface/ReadonlySequence';

export class ImmutableSequence<V extends Nominative> extends ASequence<V, 'ImmutableSequence'> {
  public readonly noun: 'ImmutableSequence' = 'ImmutableSequence';

  private static readonly EMPTY: ImmutableSequence<Nominative> = new ImmutableSequence<Nominative>([]);

  public static of<VT extends Nominative>(sequence: ReadonlySequence<VT>): ImmutableSequence<VT> {
    return ImmutableSequence.ofArray<VT>(sequence.toArray());
  }

  public static ofArray<VT extends Nominative>(array: ReadonlyArray<VT>): ImmutableSequence<VT> {
    if (array.length === 0) {
      return ImmutableSequence.empty<VT>();
    }

    return new ImmutableSequence<VT>(array);
  }

  public static empty<VT extends Nominative>(): ImmutableSequence<VT> {
    return ImmutableSequence.EMPTY as ImmutableSequence<VT>;
  }

  protected constructor(sequence: ReadonlyArray<V>) {
    super(sequence);
  }

  public set(key: number, value: V): ImmutableSequence<V> {
    if (!Kind.isInteger(key)) {
      return this;
    }
    if (key < 0 || this.sequence.length <= key) {
      return this;
    }

    const array: Array<V> = [...this.sequence.slice(0, key), value, ...this.sequence.slice(key + 1)];

    return ImmutableSequence.ofArray<V>(array);
  }

  public remove(key: number): ImmutableSequence<V> {
    if (!Kind.isInteger(key)) {
      return this;
    }
    if (key < 0 || this.sequence.length <= key) {
      return this;
    }

    const array: Array<V> = [...this.sequence.slice(0, key), ...this.sequence.slice(key + 1)];

    return ImmutableSequence.ofArray<V>(array);
  }

  public add(value: V): ImmutableSequence<V> {
    return ImmutableSequence.ofArray<V>([...this.sequence, value]);
  }

  public isEmpty(): boolean {
    if (this === ImmutableSequence.empty<V>()) {
      return true;
    }

    return super.isEmpty();
  }

  public map<W extends Nominative>(mapper: Mapper<V, W>): ImmutableSequence<W> {
    return ImmutableSequence.ofArray<W>(this.sequence.map<W>(mapper));
  }

  public filter(predicate: BinaryPredicate<V, number>): ImmutableSequence<V> {
    return ImmutableSequence.ofArray<V>(this.sequence.filter(predicate));
  }

  public duplicate(): ImmutableSequence<V> {
    if (this.isEmpty()) {
      return ImmutableSequence.empty<V>();
    }

    return ImmutableSequence.ofArray<V>([...this.sequence]);
  }
}
