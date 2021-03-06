import { isNominative } from '@jamashita/publikum-interface';
import { Mapper } from '@jamashita/publikum-type';
import { Collection } from '../Interface/Collection';
import { AAddress } from './Abstract/AAddress';

export class MutableAddress<V> extends AAddress<V, MutableAddress<V>, 'MutableAddress'> {
  public readonly noun: 'MutableAddress' = 'MutableAddress';

  public static of<VT>(collection: Collection<unknown, VT>): MutableAddress<VT> {
    const set: Set<VT> = new Set<VT>(collection.values());

    return MutableAddress.ofSet<VT>(set);
  }

  public static ofSet<VT>(set: ReadonlySet<VT>): MutableAddress<VT> {
    const m: Map<VT | string, VT> = new Map<VT | string, VT>();

    set.forEach((v: VT) => {
      if (isNominative(v)) {
        m.set(v.hashCode(), v);

        return;
      }

      m.set(v, v);
    });

    return MutableAddress.ofInternal<VT>(m);
  }

  private static ofInternal<VT>(address: Map<VT | string, VT>): MutableAddress<VT> {
    return new MutableAddress<VT>(address);
  }

  public static empty<VT>(): MutableAddress<VT> {
    return new MutableAddress<VT>(new Map<VT | string, VT>());
  }

  protected constructor(address: Map<V | string, V>) {
    super(address);
  }

  protected forge(self: Map<V | string, V>): MutableAddress<V> {
    return MutableAddress.ofInternal<V>(self);
  }

  public add(value: V): MutableAddress<V> {
    if (this.contains(value)) {
      return this;
    }

    const v: V | string = this.hashor<V>(value);

    this.address.set(v, value);

    return this;
  }

  public remove(value: V): MutableAddress<V> {
    if (this.isEmpty()) {
      return this;
    }
    if (!this.contains(value)) {
      return this;
    }

    const v: V | string = this.hashor<V>(value);

    this.address.delete(v);

    return this;
  }

  public map<W>(mapper: Mapper<V, W>): MutableAddress<W> {
    const m: Map<W | string, W> = this.mapInternal<W>(mapper);

    return MutableAddress.ofInternal<W>(m);
  }

  public duplicate(): MutableAddress<V> {
    const m: Map<V | string, V> = new Map<V | string, V>(this.address);

    return MutableAddress.ofInternal<V>(m);
  }
}
