import { Noun } from '../../interface/src/Noun';

export class Pair<K, V> implements Noun<'Pair'> {
  public readonly noun: 'Pair' = 'Pair';
  private readonly key: K;
  private readonly value: V;

  public static of<K, V>(key: K, value: V): Pair<K, V> {
    return new Pair<K, V>(key, value);
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
