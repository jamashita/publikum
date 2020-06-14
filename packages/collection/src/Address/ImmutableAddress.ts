import { Nominative, NonNominative } from '@jamashita/publikum-interface';

import { AAddress } from './Abstract/AAddress';

export class ImmutableAddress<E extends Nominative<E>> extends AAddress<E, 'ImmutableAddress'> {
  public readonly noun: 'ImmutableAddress' = 'ImmutableAddress';

  private static readonly EMPTY: ImmutableAddress<NonNominative> = new ImmutableAddress(
    new Map<string, NonNominative>()
  );

  public static of<E extends Nominative<E>>(elements: Set<E>): ImmutableAddress<E> {
    if (elements.size === 0) {
      return ImmutableAddress.empty<E>();
    }

    const map: Map<string, E> = new Map<string, E>();

    elements.forEach((e: E) => {
      map.set(e.hashCode(), e);
    });

    return ImmutableAddress.ofMap<E>(map);
  }

  private static ofMap<E extends Nominative<E>>(elements: Map<string, E>): ImmutableAddress<E> {
    return new ImmutableAddress<E>(elements);
  }

  public static empty<E extends Nominative<E>>(): ImmutableAddress<E> {
    return ImmutableAddress.EMPTY as ImmutableAddress<E>;
  }

  protected constructor(elements: Map<string, E>) {
    super(elements);
  }

  public add(...elements: Array<E>): ImmutableAddress<E> {
    if (elements.length === 0) {
      return this;
    }

    let set: boolean = false;
    const map: Map<string, E> = new Map<string, E>(this.elements);

    elements.forEach((element: E) => {
      if (this.contains(element)) {
        return;
      }

      set = true;
      map.set(element.hashCode(), element);
    });

    if (set) {
      return ImmutableAddress.ofMap<E>(map);
    }

    return this;
  }

  public remove(element: E): ImmutableAddress<E> {
    if (this.isEmpty()) {
      return this;
    }

    const map: Map<string, E> = new Map<string, E>(this.elements);

    if (map.delete(element.hashCode())) {
      if (map.size === 0) {
        return ImmutableAddress.empty<E>();
      }

      return ImmutableAddress.ofMap<E>(map);
    }

    return this;
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
