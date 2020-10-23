import { Nominative } from '@jamashita/publikum-interface';
import { BinaryPredicate, Mapper } from '@jamashita/publikum-type';
import { AAddress } from './Abstract/AAddress';
import { ReadonlyAddress } from './Interface/ReadonlyAddress';

export class MutableAddress<V extends Nominative> extends AAddress<V, 'MutableAddress'> {
  public readonly noun: 'MutableAddress' = 'MutableAddress';

  public static of<VT extends Nominative>(address: ReadonlyAddress<VT>): MutableAddress<VT> {
    return MutableAddress.ofSet<VT>(address.toSet());
  }

  public static ofSet<VT extends Nominative>(set: ReadonlySet<VT>): MutableAddress<VT> {
    const m: Map<string, VT> = new Map<string, VT>();

    set.forEach((v: VT) => {
      m.set(v.hashCode(), v);
    });

    return MutableAddress.ofInternal<VT>(m);
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

  public add(value: V): MutableAddress<V> {
    if (this.contains(value)) {
      return this;
    }

    this.address.set(value.hashCode(), value);

    return this;
  }

  public remove(value: V): MutableAddress<V> {
    if (this.isEmpty()) {
      return this;
    }
    if (!this.contains(value)) {
      return this;
    }

    this.address.delete(value.hashCode());

    return this;
  }

  public map<W extends Nominative>(mapper: Mapper<V, W>): MutableAddress<W> {
    const m: Map<string, W> = this.mapInternal<W>(mapper);

    return MutableAddress.ofInternal<W>(m);
  }

  public filter(predicate: BinaryPredicate<V, void>): MutableAddress<V> {
    const m: Map<string, V> = this.filterInternal(predicate);

    return MutableAddress.ofInternal<V>(m);
  }

  public duplicate(): MutableAddress<V> {
    return MutableAddress.ofInternal<V>(new Map<string, V>(this.address));
  }
}
