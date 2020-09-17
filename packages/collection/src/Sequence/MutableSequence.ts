import { Nominative } from '@jamashita/publikum-interface';
import { Enumerator, Mapper } from '@jamashita/publikum-type';
import { ASequence } from './Abstract/ASequence';

export class MutableSequence<E extends Nominative<E>> extends ASequence<E, 'MutableSequence'> {
  public readonly noun: 'MutableSequence' = 'MutableSequence';

  public static of<ET extends Nominative<ET>>(elements: ReadonlyArray<ET>): MutableSequence<ET> {
    return new MutableSequence<ET>([...elements]);
  }

  public static empty<ET extends Nominative<ET>>(): MutableSequence<ET> {
    return MutableSequence.of<ET>([]);
  }

  protected constructor(elements: Array<E>) {
    super(elements);
  }

  public set(index: number, element: E): MutableSequence<E> {
    if (index >= this.elements.length) {
      return this;
    }

    this.elements = [...this.elements.slice(0, index), element, ...this.elements.slice(index + 1)];

    return this;
  }

  public remove(index: number): MutableSequence<E> {
    if (index >= this.elements.length) {
      return this;
    }

    this.elements = [...this.elements.slice(0, index), ...this.elements.slice(index + 1)];

    return this;
  }

  public add(element: E): MutableSequence<E> {
    this.elements.push(element);

    return this;
  }

  public map<F extends Nominative<F>>(mapper: Mapper<E, F>): MutableSequence<F> {
    return MutableSequence.of<F>(this.elements.map<F>(mapper));
  }

  public filter(iterator: Enumerator<number, E>): MutableSequence<E> {
    return MutableSequence.of<E>(this.elements.filter(iterator));
  }

  public duplicate(): MutableSequence<E> {
    return MutableSequence.of<E>([...this.elements]);
  }
}
