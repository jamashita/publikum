import { CancellableEnumerator } from '@jamashita/publikum-collection';
import { Nominative } from '@jamashita/publikum-interface';
import { BinaryPredicate, Nullable } from '@jamashita/publikum-type';
import { TreeNode } from './TreeNode/TreeNode';

export interface Trees<K, V extends Nominative, T extends TreeNode<V, T>, N extends string = string> extends Nominative<N> {
  contains(value: V): boolean;

  every(predicate: BinaryPredicate<V, K>): boolean;

  find(predicate: BinaryPredicate<V, K>): Nullable<V>;

  forEach(iteration: CancellableEnumerator<K, V>): void;

  get(key: K): Nullable<V>;

  isEmpty(): boolean;

  size(): number;

  some(predicate: BinaryPredicate<V, K>): boolean;

  values(): Iterable<V>;
}
