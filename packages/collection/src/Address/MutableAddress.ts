import { Nominative } from '@jamashita/publikum-interface';
import { AAddress } from './Abstract/AAddress';

export class MutableAddress<E extends Nominative<E>> extends AAddress<E, 'MutableAddress'> {
  public readonly noun: 'MutableAddress' = 'MutableAddress';

  public static of<ET extends Nominative<ET>>(elements: ReadonlySet<ET>): MutableAddress<ET> {
    if (elements.size === 0) {
      return MutableAddress.empty<ET>();
    }

    const map: Map<string, ET> = new Map<string, ET>();

    elements.forEach((e: ET) => {
      map.set(e.hashCode(), e);
    });

    return MutableAddress.ofMap<ET>(map);
  }

  private static ofMap<ET extends Nominative<ET>>(elements: Map<string, ET>): MutableAddress<ET> {
    return new MutableAddress<ET>(elements);
  }

  public static empty<ET extends Nominative<ET>>(): MutableAddress<ET> {
    return MutableAddress.ofMap(new Map<string, ET>());
  }

  protected constructor(elements: Map<string, E>) {
    super(elements);
  }

  public add(element: E): MutableAddress<E> {
    if (this.contains(element)) {
      return this;
    }

    this.elements.set(element.hashCode(), element);

    return this;
  }

  public remove(element: E): MutableAddress<E> {
    if (this.isEmpty()) {
      return this;
    }
    if (!this.contains(element)) {
      return this;
    }

    this.elements.delete(element.hashCode());

    return this;
  }

  public duplicate(): MutableAddress<E> {
    return MutableAddress.ofMap<E>(new Map<string, E>(this.elements));
  }
}
