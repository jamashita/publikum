import { ReadonlyTreeNode } from './ReadonlyTreeNode';

export interface TreeNode<V, T extends TreeNode<V, T>, N extends string = string> extends ReadonlyTreeNode<V, T, N> {
  set(value: V): void;
}
