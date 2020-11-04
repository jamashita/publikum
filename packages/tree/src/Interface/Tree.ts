import { Nominative } from '@jamashita/publikum-interface';
import { Enumerator, Nullable, Predicate } from '@jamashita/publikum-type';
import { TreeNode } from '../TreeNode/Interface/TreeNode';

export interface Tree<V extends Nominative, N extends string = string> extends Nominative<N> {
  getRoot(): TreeNode<V>;

  contains(value: V): boolean;

  every(predicate: Predicate<V>): boolean;

  forEach(iteration: Enumerator<unknown, V>): void;

  find(predicate: Predicate<V>): Nullable<TreeNode<V>>;

  size(): number;

  some(predicate: Predicate<V>): boolean;

  values(): Iterable<V>;
}
