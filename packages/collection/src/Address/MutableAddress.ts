import { isNominative } from '@jamashita/publikum-interface';
import { Mapper } from '@jamashita/publikum-type';
import { AAddress } from './Abstract/AAddress';
import { ReadonlyAddress } from './Interface/ReadonlyAddress';

export class MutableAddress<V> extends AAddress<V, MutableAddress<V>, 'MutableAddress'> {
  public readonly noun: 'MutableAddress' = 'MutableAddress';

  public static of<VT>(address: ReadonlyAddress<VT>): MutableAddress<VT> {
    return MutableAddress.ofSet<VT>(address.toSet());
  }

  public static ofSet<VT>(set: ReadonlySet<VT>): MutableAddress<VT> {
    const m: Map<unknown, VT> = new Map<unknown, VT>();

    set.forEach((v: VT) => {
      if (isNominative(v)) {
        m.set(v.hashCode(), v);

        return;
      }

      m.set(v, v);
    });

    return MutableAddress.ofInternal<VT>(m);
  }

  private static ofInternal<VT>(address: Map<unknown, VT>): MutableAddress<VT> {
    return new MutableAddress<VT>(address);
  }

  public static empty<VT>(): MutableAddress<VT> {
    return new MutableAddress<VT>(new Map<unknown, VT>());
  }

  protected constructor(address: Map<unknown, V>) {
    super(address);
  }

  protected forge(self: Map<string, V>): MutableAddress<V> {
    return MutableAddress.ofInternal<V>(self);
  }

  public add(value: V): MutableAddress<V> {
    if (this.contains(value)) {
      return this;
    }

    if (isNominative(value)) {
      this.address.set(value.hashCode(), value);

      return this;
    }

    this.address.set(value, value);

    return this;
  }

  public remove(value: V): MutableAddress<V> {
    if (this.isEmpty()) {
      return this;
    }
    if (!this.contains(value)) {
      return this;
    }

    if (isNominative(value)) {
      this.address.delete(value.hashCode());

      return this;
    }

    this.address.delete(value);

    return this;
  }

  public map<W>(mapper: Mapper<V, W>): MutableAddress<W> {
    const m: Map<unknown, W> = this.mapInternal<W>(mapper);

    return MutableAddress.ofInternal<W>(m);
  }

  public duplicate(): MutableAddress<V> {
    return MutableAddress.ofInternal<V>(new Map<unknown, V>(this.address));
  }
}
