import { ReadonlyAddress } from '@jamashita/publikum-collection';
import { Nominative } from '@jamashita/publikum-interface';
import { Mapper } from '@jamashita/publikum-type';
import { AAddress } from './Abstract/AAddress';

export class ImmutableAddress<V extends Nominative> extends AAddress<V, 'ImmutableAddress'> {
  public readonly noun: 'ImmutableAddress' = 'ImmutableAddress';

  private static readonly EMPTY: ImmutableAddress<Nominative> = new ImmutableAddress(new Map<string, Nominative>());

  public static of<VT extends Nominative>(elements: ReadonlyAddress<VT>): ImmutableAddress<VT> {
    return ImmutableAddress.ofSet<VT>(elements.toSet());
  }

  public static ofSet<VT extends Nominative>(elements: ReadonlySet<VT>): ImmutableAddress<VT> {
    const map: Map<string, VT> = new Map<string, VT>();

    elements.forEach((v: VT) => {
      map.set(v.hashCode(), v);
    });

    return ImmutableAddress.ofInternal<VT>(map);
  }

  private static ofInternal<VT extends Nominative>(elements: Map<string, VT>): ImmutableAddress<VT> {
    if (elements.size === 0) {
      return ImmutableAddress.empty<VT>();
    }

    return new ImmutableAddress<VT>(elements);
  }

  public static empty<VT extends Nominative>(): ImmutableAddress<VT> {
    return ImmutableAddress.EMPTY as ImmutableAddress<VT>;
  }

  protected constructor(elements: Map<string, V>) {
    super(elements);
  }

  public add(element: V): ImmutableAddress<V> {
    if (this.contains(element)) {
      return this;
    }

    const map: Map<string, V> = new Map<string, V>(this.elements);

    map.set(element.hashCode(), element);

    return ImmutableAddress.ofInternal<V>(map);
  }

  public remove(element: V): ImmutableAddress<V> {
    if (this.isEmpty()) {
      return this;
    }
    if (!this.contains(element)) {
      return this;
    }

    const map: Map<string, V> = new Map<string, V>(this.elements);

    map.delete(element.hashCode());

    if (map.size === 0) {
      return ImmutableAddress.empty<V>();
    }

    return ImmutableAddress.ofInternal<V>(map);
  }

  public isEmpty(): boolean {
    if (this === ImmutableAddress.empty<V>()) {
      return true;
    }

    return super.isEmpty();
  }

  public map<W extends Nominative>(mapper: Mapper<V, W>): ImmutableAddress<W> {
    const map: Map<string, W> = new Map<string, W>();
    let i: number = 0;

    this.elements.forEach((v: V) => {
      map.set(v.hashCode(), mapper(v, i));
      i++;
    });

    return ImmutableAddress.ofInternal<W>(map);
  }

  public duplicate(): ImmutableAddress<V> {
    if (this.isEmpty()) {
      return ImmutableAddress.empty<V>();
    }

    const map: Map<string, V> = new Map<string, V>(this.elements);

    return ImmutableAddress.ofInternal<V>(map);
  }
}
