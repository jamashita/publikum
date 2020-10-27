import { ImmutableProject } from '@jamashita/publikum-collection';
import { MockTree, MockTreeNode, StructurableTreeNode, TreeID } from '@jamashita/publikum-tree';
import { Trees } from '../Trees';

export class MockTrees<K extends TreeID, V extends StructurableTreeNode<K, V>> extends Trees<K, V, MockTreeNode<K, V>, MockTree<K, V>, 'MockTrees'> {
  public readonly noun: 'MockTrees' = 'MockTrees';

  public constructor(trees: ImmutableProject<K, MockTree<K, V>>) {
    super(trees);
  }
}
