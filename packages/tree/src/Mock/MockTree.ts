import { ATree } from '../Abstract/ATree';
import { StructurableTreeObject } from '../Interface/StructurableTreeObject';
import { TreeID } from '../Interface/TreeID';
import { MockTreeNode } from '../TreeNode/Mock/MockTreeNode';

export class MockTree<K extends TreeID, V extends StructurableTreeObject<K>> extends ATree<V, MockTreeNode<K, V>, 'MockTree'> {
  public readonly noun: 'MockTree' = 'MockTree';

  public constructor(root: MockTreeNode<K, V>) {
    super(root);
  }
}
