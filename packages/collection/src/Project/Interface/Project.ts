import { Nominative } from '@jamashita/publikum-interface';
import { BinaryPredicate, Mapper } from '@jamashita/publikum-type';
import { ReadonlyProject } from './ReadonlyProject';

export interface Project<K extends Nominative, V extends Nominative, N extends string = string> extends ReadonlyProject<K, V, N> {
  set(key: K, value: V): Project<K, V>;

  remove(key: K): Project<K, V>;

  map<W extends Nominative>(mapper: Mapper<V, W>): Project<K, W>;

  filter(predicate: BinaryPredicate<V, K>): Project<K, V>;
}
