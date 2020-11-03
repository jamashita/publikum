import { Nominative } from '@jamashita/publikum-interface';
import { BinaryPredicate, Enumerator, Nullable } from '@jamashita/publikum-type';
import { Tree } from './Tree';
import { TreeNode } from './TreeNode/TreeNode';

export interface Trees<K, V extends Nominative, T extends TreeNode<V, T>, E extends Tree<V, T>, N extends string = string> extends Nominative<N> {
  contains(value: V): boolean;

  every(predicate: BinaryPredicate<V, K>): boolean;

  find(predicate: BinaryPredicate<V, K>): Nullable<V>;

  forEach(iteration: Enumerator<K, V>): void;

  get(key: K): Nullable<E>;

  isEmpty(): boolean;

  size(): number;

  some(predicate: BinaryPredicate<V, K>): boolean;

  values(): Iterable<V>;
}
