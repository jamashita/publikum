import { Objet, ValueObject } from '@jamashita/publikum-object';

export class Pair<K, V> extends ValueObject<'Pair'> {
  public readonly noun: 'Pair' = 'Pair';
  private readonly key: K;
  private readonly value: V;

  public static of<KT, VT>(key: KT, value: VT): Pair<KT, VT> {
    return new Pair<KT, VT>(key, value);
  }

  protected constructor(key: K, value: V) {
    super();
    this.key = key;
    this.value = value;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    return `{${Objet.identify(this.key)}: ${Objet.identify(this.value)}}`;
  }

  public getKey(): K {
    return this.key;
  }

  public getValue(): V {
    return this.value;
  }
}
