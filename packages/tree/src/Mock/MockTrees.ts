import { ReadonlyProject } from '@jamashita/publikum-collection';
import { TreeID } from '../Interface/TreeID';
import { MockTreeNode } from '../TreeNode/Mock/MockTreeNode';
import { Trees } from '../Trees';
import { MockTree } from './MockTree';
import { MockTreeObject } from './MockTreeObject';

export class MockTrees<K extends TreeID, V extends MockTreeObject<K>> extends Trees<K, V, MockTreeNode<K, V>, MockTree<K, V>, ReadonlyProject<K, MockTree<K, V>>, 'MockTrees'> {
  public readonly noun: 'MockTrees' = 'MockTrees';

  public constructor(trees: ReadonlyProject<K, MockTree<K, V>>) {
    super(trees);
  }
}
