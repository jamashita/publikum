import { Nominative } from '@jamashita/publikum-interface';
import { ReadonlyProject } from './ReadonlyProject';

export interface Project<K extends Nominative, V extends Nominative, N extends string = string> extends ReadonlyProject<K, V, N> {
  set(key: K, value: V): Project<K, V>;

  remove(key: K): Project<K, V>;
}
