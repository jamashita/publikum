import { Nominative } from '@jamashita/publikum-interface';
import { ReadonlyTreeNode } from './ReadonlyTreeNode';

export interface TreeNode<V extends Nominative, N extends string = string> extends ReadonlyTreeNode<V, N> {
  append(node: TreeNode<V>): TreeNode<V>;
}
