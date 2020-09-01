import { Noun } from '@jamashita/publikum-interface';

export class Pair<K, V> implements Noun<'Pair'> {
  public readonly noun: 'Pair' = 'Pair';
  private readonly key: K;
  private readonly value: V;

  public static of<KT, VT>(key: KT, value: VT): Pair<KT, VT> {
    return new Pair<KT, VT>(key, value);
  }

  protected constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }

  public getKey(): K {
    return this.key;
  }

  public getValue(): V {
    return this.value;
  }
}
