import { isNominative } from '@jamashita/publikum-interface';
import { Mapper } from '@jamashita/publikum-type';
import { AAddress } from './Abstract/AAddress';
import { ReadonlyAddress } from './Interface/ReadonlyAddress';

export class ImmutableAddress<V> extends AAddress<V, ImmutableAddress<V>, 'ImmutableAddress'> {
  public readonly noun: 'ImmutableAddress' = 'ImmutableAddress';

  private static readonly EMPTY: ImmutableAddress<unknown> = new ImmutableAddress(new Map<unknown, unknown>());

  public static of<VT>(address: ReadonlyAddress<VT>): ImmutableAddress<VT> {
    return ImmutableAddress.ofSet<VT>(address.toSet());
  }

  public static ofSet<VT>(set: ReadonlySet<VT>): ImmutableAddress<VT> {
    const m: Map<unknown, VT> = new Map<unknown, VT>();

    set.forEach((v: VT) => {
      if (isNominative(v)) {
        m.set(v.hashCode(), v);

        return;
      }

      m.set(v, v);
    });

    return ImmutableAddress.ofInternal<VT>(m);
  }

  private static ofInternal<VT>(address: Map<unknown, VT>): ImmutableAddress<VT> {
    if (address.size === 0) {
      return ImmutableAddress.empty<VT>();
    }

    return new ImmutableAddress<VT>(address);
  }

  public static empty<VT>(): ImmutableAddress<VT> {
    return ImmutableAddress.EMPTY as ImmutableAddress<VT>;
  }

  protected constructor(address: Map<unknown, V>) {
    super(address);
  }

  protected forge(self: Map<unknown, V>): ImmutableAddress<V> {
    return ImmutableAddress.ofInternal<V>(self);
  }

  public add(value: V): ImmutableAddress<V> {
    if (this.contains(value)) {
      return this;
    }

    const m: Map<unknown, V> = new Map<unknown, V>(this.address);

    if (isNominative(value)) {
      m.set(value.hashCode(), value);

      return ImmutableAddress.ofInternal<V>(m);
    }

    m.set(value, value);

    return ImmutableAddress.ofInternal<V>(m);
  }

  public remove(value: V): ImmutableAddress<V> {
    if (this.isEmpty()) {
      return this;
    }
    if (!this.contains(value)) {
      return this;
    }

    const m: Map<unknown, V> = new Map<unknown, V>(this.address);

    if (isNominative(value)) {
      m.delete(value.hashCode());

      return ImmutableAddress.ofInternal<V>(m);
    }

    m.delete(value);

    return ImmutableAddress.ofInternal<V>(m);
  }

  public isEmpty(): boolean {
    if (this === ImmutableAddress.empty<V>()) {
      return true;
    }

    return super.isEmpty();
  }

  public map<W>(mapper: Mapper<V, W>): ImmutableAddress<W> {
    const m: Map<unknown, W> = this.mapInternal<W>(mapper);

    return ImmutableAddress.ofInternal<W>(m);
  }

  public duplicate(): ImmutableAddress<V> {
    if (this.isEmpty()) {
      return ImmutableAddress.empty<V>();
    }

    const m: Map<unknown, V> = new Map<unknown, V>(this.address);

    return ImmutableAddress.ofInternal<V>(m);
  }
}
