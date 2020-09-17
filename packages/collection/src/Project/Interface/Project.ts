import { Nominative } from '@jamashita/publikum-interface';
import { ReadonlyProject } from './ReadonlyProject';

export interface Project<K extends Nominative<K>, V extends Nominative<V>, N extends string = string>
  extends ReadonlyProject<Project<K, V, N>, K, V, N> {
  set(key: K, value: V): Project<K, V, N>;

  remove(key: K): Project<K, V, N>;
}
