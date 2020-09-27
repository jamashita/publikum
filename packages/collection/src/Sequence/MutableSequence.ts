import { Nominative } from '@jamashita/publikum-interface';
import { Enumerator, Mapper } from '@jamashita/publikum-type';
import { ASequence } from './Abstract/ASequence';
import { ReadonlySequence } from './Interface/ReadonlySequence';

export class MutableSequence<V extends Nominative> extends ASequence<V, 'MutableSequence'> {
  public readonly noun: 'MutableSequence' = 'MutableSequence';

  public static of<VT extends Nominative>(elements: ReadonlySequence<VT>): MutableSequence<VT> {
    return MutableSequence.ofArray<VT>(elements.toArray());
  }

  public static ofArray<VT extends Nominative>(elements: ReadonlyArray<VT>): MutableSequence<VT> {
    return new MutableSequence<VT>([...elements]);
  }

  public static empty<VT extends Nominative>(): MutableSequence<VT> {
    return MutableSequence.ofArray<VT>([]);
  }

  protected constructor(elements: Array<V>) {
    super(elements);
  }

  public set(key: number, value: V): MutableSequence<V> {
    if (key >= this.elements.length) {
      return this;
    }

    this.elements = [...this.elements.slice(0, key), value, ...this.elements.slice(key + 1)];

    return this;
  }

  public remove(key: number): MutableSequence<V> {
    if (key >= this.elements.length) {
      return this;
    }

    this.elements = [...this.elements.slice(0, key), ...this.elements.slice(key + 1)];

    return this;
  }

  public add(value: V): MutableSequence<V> {
    this.elements.push(value);

    return this;
  }

  public map<W extends Nominative>(mapper: Mapper<V, W>): MutableSequence<W> {
    return MutableSequence.ofArray<W>(this.elements.map<W>(mapper));
  }

  public filter(iterator: Enumerator<number, V>): MutableSequence<V> {
    return MutableSequence.ofArray<V>(this.elements.filter(iterator));
  }

  public duplicate(): MutableSequence<V> {
    return MutableSequence.ofArray<V>([...this.elements]);
  }
}
