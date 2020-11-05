import { Nominative } from '@jamashita/publikum-interface';
import { ReadonlyTrees } from './ReadonlyTrees';
import { Tree } from './Tree';

export interface Trees<K, V extends Nominative, E extends Tree<V>, N extends string = string> extends ReadonlyTrees<K, V, E, N> {
  add(tree: E): Trees<K, V, E>;
}
