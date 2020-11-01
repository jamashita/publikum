import { Nominative } from '@jamashita/publikum-interface';
import { Nullable, Predicate } from '@jamashita/publikum-type';
import { TreeNode } from './TreeNode/TreeNode';

export interface Tree<V extends Nominative, T extends TreeNode<V, T>, N extends string = string> extends Nominative<N> {
  getRoot(): T;

  contains(value: V): boolean;

  find(predicate: Predicate<V>): Nullable<T>;

  size(): number;

  values(): Iterable<V>;
}
