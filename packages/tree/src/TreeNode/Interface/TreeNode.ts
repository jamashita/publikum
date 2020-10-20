import { ReadonlyAddress } from '@jamashita/publikum-collection';
import { Nominative } from '@jamashita/publikum-interface';

export interface TreeNode<V, T extends TreeNode<V, T>, N extends string = string> extends Nominative<N> {
  getValue(): V;

  getChildren(): ReadonlyAddress<T>;

  isLeaf(): boolean;
}
