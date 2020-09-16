import { AnonymousNominative, Nominative } from '@jamashita/publikum-interface';
import { AAddress } from './Abstract/AAddress';

export class ImmutableAddress<E extends Nominative<E>> extends AAddress<E, 'ImmutableAddress'> {
  public readonly noun: 'ImmutableAddress' = 'ImmutableAddress';

  private static readonly EMPTY: ImmutableAddress<AnonymousNominative> = new ImmutableAddress(
    new Map<string, AnonymousNominative>()
  );

  public static of<ET extends Nominative<ET>>(elements: Set<ET>): ImmutableAddress<ET> {
    if (elements.size === 0) {
      return ImmutableAddress.empty<ET>();
    }

    const map: Map<string, ET> = new Map<string, ET>();

    elements.forEach((e: ET) => {
      map.set(e.hashCode(), e);
    });

    return ImmutableAddress.ofMap<ET>(map);
  }

  private static ofMap<ET extends Nominative<ET>>(elements: Map<string, ET>): ImmutableAddress<ET> {
    return new ImmutableAddress<ET>(elements);
  }

  public static empty<ET extends Nominative<ET>>(): ImmutableAddress<ET> {
    return ImmutableAddress.EMPTY as ImmutableAddress<ET>;
  }

  protected constructor(elements: Map<string, E>) {
    super(elements);
  }

  public add(element: E): ImmutableAddress<E> {
    if (this.contains(element)) {
      return this;
    }

    const map: Map<string, E> = new Map<string, E>(this.elements);

    map.set(element.hashCode(), element);

    return ImmutableAddress.ofMap<E>(map);
  }

  public remove(element: E): ImmutableAddress<E> {
    if (this.isEmpty()) {
      return this;
    }
    if (!this.contains(element)) {
      return this;
    }

    const map: Map<string, E> = new Map<string, E>(this.elements);

    map.delete(element.hashCode());

    if (map.size === 0) {
      return ImmutableAddress.empty<E>();
    }

    return ImmutableAddress.ofMap<E>(map);
  }

  public isEmpty(): boolean {
    if (this === ImmutableAddress.empty<E>()) {
      return true;
    }

    return super.isEmpty();
  }

  public duplicate(): ImmutableAddress<E> {
    if (this.isEmpty()) {
      return ImmutableAddress.empty<E>();
    }

    const map: Map<string, E> = new Map<string, E>(this.elements);

    return ImmutableAddress.ofMap<E>(map);
  }
}
