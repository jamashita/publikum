import { ImmutableAddress, ReadonlyAddress } from '@jamashita/publikum-collection';
import { StructurableTreeObject } from '../../Interface/StructurableTreeObject';
import { TreeID } from '../../Interface/TreeID';
import { TreeNode } from '../TreeNode';

export class MockTreeNode<K extends TreeID, V extends StructurableTreeObject<K>> extends TreeNode<V, MockTreeNode<K, V>, 'MockTreeNode'> {
  public readonly noun: 'MockTreeNode' = 'MockTreeNode';

  public constructor(value: V, children: ReadonlyAddress<MockTreeNode<K, V>> = ImmutableAddress.empty<MockTreeNode<K, V>>()) {
    super(value, children);
  }

  protected forge(node: TreeNode<V, MockTreeNode<K, V>>): MockTreeNode<K, V> {
    return new MockTreeNode<K, V>(node.getValue(), node.getChildren());
  }
}
