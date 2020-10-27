import { ReadonlyProject } from '@jamashita/publikum-collection';
import { MockTree, MockTreeNode, MockTreeObject, TreeID } from '@jamashita/publikum-tree';
import { Trees } from '../Trees';

export class MockTrees<K extends TreeID, V extends MockTreeObject<K>> extends Trees<K, V, MockTreeNode<K, V>, MockTree<K, V>, 'MockTrees'> {
  public readonly noun: 'MockTrees' = 'MockTrees';

  public constructor(trees: ReadonlyProject<K, MockTree<K, V>>) {
    super(trees);
  }
}
