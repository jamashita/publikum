import { Nominative } from '@jamashita/publikum-interface';
import { BinaryPredicate, Mapper } from '@jamashita/publikum-type';
import { AAddress } from './Abstract/AAddress';
import { ReadonlyAddress } from './Interface/ReadonlyAddress';

export class ImmutableAddress<V extends Nominative> extends AAddress<V, 'ImmutableAddress'> {
  public readonly noun: 'ImmutableAddress' = 'ImmutableAddress';
  private static readonly EMPTY: ImmutableAddress<Nominative> = new ImmutableAddress(new Map<string, Nominative>());

  public static of<VT extends Nominative>(address: ReadonlyAddress<VT>): ImmutableAddress<VT> {
    return ImmutableAddress.ofSet<VT>(address.toSet());
  }

  public static ofSet<VT extends Nominative>(set: ReadonlySet<VT>): ImmutableAddress<VT> {
    const m: Map<string, VT> = new Map<string, VT>();

    set.forEach((v: VT) => {
      m.set(v.hashCode(), v);
    });

    return ImmutableAddress.ofInternal<VT>(m);
  }

  private static ofInternal<VT extends Nominative>(address: ReadonlyMap<string, VT>): ImmutableAddress<VT> {
    if (address.size === 0) {
      return ImmutableAddress.empty<VT>();
    }

    return new ImmutableAddress<VT>(address);
  }

  public static empty<VT extends Nominative>(): ImmutableAddress<VT> {
    return ImmutableAddress.EMPTY as ImmutableAddress<VT>;
  }

  protected constructor(address: ReadonlyMap<string, V>) {
    super(address);
  }

  public add(value: V): ImmutableAddress<V> {
    if (this.contains(value)) {
      return this;
    }

    const m: Map<string, V> = new Map<string, V>(this.address);

    m.set(value.hashCode(), value);

    return ImmutableAddress.ofInternal<V>(m);
  }

  public remove(value: V): ImmutableAddress<V> {
    if (this.isEmpty()) {
      return this;
    }
    if (!this.contains(value)) {
      return this;
    }

    const m: Map<string, V> = new Map<string, V>(this.address);

    m.delete(value.hashCode());

    return ImmutableAddress.ofInternal<V>(m);
  }

  public isEmpty(): boolean {
    if (this === ImmutableAddress.empty<V>()) {
      return true;
    }

    return super.isEmpty();
  }

  public map<W extends Nominative>(mapper: Mapper<V, W>): ImmutableAddress<W> {
    const m: Map<string, W> = this.mapInternal<W>(mapper);

    return ImmutableAddress.ofInternal<W>(m);
  }

  public filter(predicate: BinaryPredicate<V, void>): ImmutableAddress<V> {
    const m: Map<string, V> = this.filterInternal(predicate);

    return ImmutableAddress.ofInternal<V>(m);
  }

  public duplicate(): ImmutableAddress<V> {
    if (this.isEmpty()) {
      return ImmutableAddress.empty<V>();
    }

    const m: Map<string, V> = new Map<string, V>(this.address);

    return ImmutableAddress.ofInternal<V>(m);
  }
}
