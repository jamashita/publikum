import { ImmutableAddress, ReadonlyAddress } from '@jamashita/publikum-collection';
import { StructurableTreeObject } from '../../Interface/StructurableTreeObject';
import { TreeID } from '../../Interface/TreeID';
import { ATreeNode } from '../Abstract/ATreeNode';

export class MockTreeNode<K extends TreeID, V extends StructurableTreeObject<K>> extends ATreeNode<V, MockTreeNode<K, V>, 'MockTreeNode'> {
  public readonly noun: 'MockTreeNode' = 'MockTreeNode';

  public constructor(value: V, children: ReadonlyAddress<MockTreeNode<K, V>> = ImmutableAddress.empty<MockTreeNode<K, V>>()) {
    super(value, ImmutableAddress.of<MockTreeNode<K, V>>(children));
  }

  protected forge(node: ATreeNode<V, MockTreeNode<K, V>>): MockTreeNode<K, V> {
    return new MockTreeNode<K, V>(node.getValue(), node.getChildren());
  }

  public append(node: MockTreeNode<K, V>): MockTreeNode<K, V> {
    this.children = this.children.add(node);

    return this;
  }
}
