import { ReadonlySequence } from '@jamashita/publikum-collection';
import { Nominative } from '@jamashita/publikum-interface';
import { Enumerator, Mapper } from '@jamashita/publikum-type';
import { ASequence } from './Abstract/ASequence';

export class ImmutableSequence<V extends Nominative> extends ASequence<V, 'ImmutableSequence'> {
  public readonly noun: 'ImmutableSequence' = 'ImmutableSequence';

  private static readonly EMPTY: ImmutableSequence<Nominative> = new ImmutableSequence<Nominative>([]);

  public static of<VT extends Nominative>(elements: ReadonlySequence<VT>): ImmutableSequence<VT> {
    return ImmutableSequence.ofArray<VT>(elements.toArray());
  }

  public static ofArray<VT extends Nominative>(elements: ReadonlyArray<VT>): ImmutableSequence<VT> {
    if (elements.length === 0) {
      return ImmutableSequence.empty<VT>();
    }

    return new ImmutableSequence<VT>([...elements]);
  }

  public static empty<VT extends Nominative>(): ImmutableSequence<VT> {
    return ImmutableSequence.EMPTY as ImmutableSequence<VT>;
  }

  protected constructor(elements: Array<V>) {
    super(elements);
  }

  public set(key: number, value: V): ImmutableSequence<V> {
    if (key >= this.elements.length) {
      return this;
    }

    const elements: Array<V> = [...this.elements.slice(0, key), value, ...this.elements.slice(key + 1)];

    return ImmutableSequence.ofArray<V>(elements);
  }

  public remove(key: number): ImmutableSequence<V> {
    if (key >= this.elements.length) {
      return this;
    }

    const elements: Array<V> = [...this.elements.slice(0, key), ...this.elements.slice(key + 1)];

    return ImmutableSequence.ofArray<V>(elements);
  }

  public add(value: V): ImmutableSequence<V> {
    return ImmutableSequence.ofArray<V>([...this.elements, value]);
  }

  public isEmpty(): boolean {
    if (this === ImmutableSequence.empty<V>()) {
      return true;
    }

    return super.isEmpty();
  }

  public map<W extends Nominative>(mapper: Mapper<V, W>): ImmutableSequence<W> {
    return ImmutableSequence.ofArray<W>(this.elements.map<W>(mapper));
  }

  public filter(iterator: Enumerator<number, V>): ImmutableSequence<V> {
    return ImmutableSequence.ofArray<V>(this.elements.filter(iterator));
  }

  public duplicate(): ImmutableSequence<V> {
    if (this.isEmpty()) {
      return ImmutableSequence.empty<V>();
    }

    return ImmutableSequence.ofArray<V>([...this.elements]);
  }
}
