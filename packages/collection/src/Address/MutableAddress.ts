import { Nominative } from '@jamashita/publikum-interface';
import { Mapper } from '@jamashita/publikum-type';
import { AAddress } from './Abstract/AAddress';
import { ReadonlyAddress } from './Interface/ReadonlyAddress';

export class MutableAddress<V extends Nominative> extends AAddress<V, 'MutableAddress'> {
  public readonly noun: 'MutableAddress' = 'MutableAddress';

  // TODO TEST
  public static of<VT extends Nominative>(elements: ReadonlyAddress<VT>): MutableAddress<VT> {
    return MutableAddress.ofSet<VT>(elements.toSet());
  }

  public static ofSet<VT extends Nominative>(elements: ReadonlySet<VT>): MutableAddress<VT> {
    const map: Map<string, VT> = new Map<string, VT>();

    elements.forEach((v: VT) => {
      map.set(v.hashCode(), v);
    });

    return MutableAddress.ofInternal<VT>(map);
  }

  private static ofInternal<VT extends Nominative>(elements: Map<string, VT>): MutableAddress<VT> {
    if (elements.size === 0) {
      return MutableAddress.empty<VT>();
    }

    return new MutableAddress<VT>(elements);
  }

  public static empty<VT extends Nominative>(): MutableAddress<VT> {
    return new MutableAddress<VT>(new Map<string, VT>());
  }

  protected constructor(elements: ReadonlyMap<string, V>) {
    super(elements);
  }

  public add(element: V): MutableAddress<V> {
    if (this.contains(element)) {
      return this;
    }

    this.elements.set(element.hashCode(), element);

    return this;
  }

  public remove(element: V): MutableAddress<V> {
    if (this.isEmpty()) {
      return this;
    }
    if (!this.contains(element)) {
      return this;
    }

    this.elements.delete(element.hashCode());

    return this;
  }

  public map<W extends Nominative>(mapper: Mapper<V, W>): MutableAddress<W> {
    const map: Map<string, W> = new Map<string, W>();
    let i: number = 0;

    this.elements.forEach((v: V) => {
      map.set(v.hashCode(), mapper(v, i));
      i++;
    });

    return MutableAddress.ofInternal<W>(map);
  }

  public duplicate(): MutableAddress<V> {
    return MutableAddress.ofInternal<V>(new Map<string, V>(this.elements));
  }
}
