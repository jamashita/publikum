import { Nominative } from '@jamashita/publikum-interface';
import { TreeNode } from '../TreeNode/Interface/TreeNode';

export interface Tree<V extends Nominative, T extends TreeNode<V, T>, N extends string = string> extends Nominative<N> {
  getRoot(): T;
}
