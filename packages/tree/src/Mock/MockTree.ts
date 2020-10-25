import { StructurableTreeObject } from '../Interface/StructurableTreeObject';
import { TreeID } from '../Interface/TreeID';
import { Tree } from '../Tree';
import { MockTreeNode } from '../TreeNode/Mock/MockTreeNode';

export class MockTree<K extends TreeID, V extends StructurableTreeObject<K>> extends Tree<V, MockTreeNode<K, V>, 'MockTree'> {
  public readonly noun: 'MockTree' = 'MockTree';

  public constructor(root: MockTreeNode<K, V>) {
    super(root);
  }
}
