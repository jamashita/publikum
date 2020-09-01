import { AnonymousNominative, Nominative } from '@jamashita/publikum-interface';
import { Enumerator, Mapper } from '@jamashita/publikum-type';
import { ASequence } from './Abstract/ASequence';

export class ImmutableSequence<E extends Nominative<E>> extends ASequence<E, 'ImmutableSequence'> {
  public readonly noun: 'ImmutableSequence' = 'ImmutableSequence';

  private static readonly EMPTY: ImmutableSequence<AnonymousNominative> = new ImmutableSequence<AnonymousNominative>([]);

  public static of<ET extends Nominative<ET>>(elements: Array<ET>): ImmutableSequence<ET> {
    if (elements.length === 0) {
      return ImmutableSequence.empty<ET>();
    }

    return new ImmutableSequence<ET>([...elements]);
  }

  public static empty<ET extends Nominative<ET>>(): ImmutableSequence<ET> {
    return ImmutableSequence.EMPTY as ImmutableSequence<ET>;
  }

  protected constructor(elements: Array<E>) {
    super(elements);
  }

  public set(index: number, element: E): ImmutableSequence<E> {
    if (index >= this.elements.length) {
      return this;
    }

    const elements: Array<E> = [...this.elements.slice(0, index), element, ...this.elements.slice(index + 1)];

    return ImmutableSequence.of<E>(elements);
  }

  public remove(index: number): ImmutableSequence<E> {
    if (index >= this.elements.length) {
      return this;
    }

    const elements: Array<E> = [...this.elements.slice(0, index), ...this.elements.slice(index + 1)];

    return ImmutableSequence.of<E>(elements);
  }

  public add(...elements: ReadonlyArray<E>): ImmutableSequence<E> {
    if (elements.length === 0) {
      return this;
    }

    return ImmutableSequence.of<E>([...this.elements, ...elements]);
  }

  public isEmpty(): boolean {
    if (this === ImmutableSequence.empty<E>()) {
      return true;
    }

    return super.isEmpty();
  }

  public map<F extends Nominative<F>>(mapper: Mapper<E, F>): ImmutableSequence<F> {
    return ImmutableSequence.of<F>(this.elements.map<F>(mapper));
  }

  public filter(iterator: Enumerator<number, E>): ImmutableSequence<E> {
    return ImmutableSequence.of<E>(this.elements.filter(iterator));
  }

  public duplicate(): ImmutableSequence<E> {
    if (this.isEmpty()) {
      return ImmutableSequence.empty<E>();
    }

    return ImmutableSequence.of<E>([...this.elements]);
  }
}
