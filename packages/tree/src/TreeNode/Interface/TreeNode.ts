import { ReadonlyAddress } from '@jamashita/publikum-collection';
import { Nominative } from '@jamashita/publikum-interface';
import { Nullable, Predicate } from '@jamashita/publikum-type';

export interface TreeNode<V, T extends TreeNode<V, T>, N extends string = string> extends Nominative<N> {
  getValue(): V;

  getChildren(): ReadonlyAddress<T>;

  contains(value: V): boolean;

  size(): number;

  isLeaf(): boolean;

  find(predicate: Predicate<V>): Nullable<V>;
}
