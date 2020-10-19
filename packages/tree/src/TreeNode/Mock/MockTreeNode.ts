import { ImmutableAddress, ReadonlyAddress } from '@jamashita/publikum-collection';
import { StructurableTreeObject } from '../../Interface/StructurableTreeObject';
import { TreeID } from '../../Interface/TreeID';
import { ATreeNode } from '../Abstract/ATreeNode';

export class MockTreeNode<K extends TreeID, V extends StructurableTreeObject<K>> extends ATreeNode<V, MockTreeNode<K, V>, 'MockTreeNode'> {
  public constructor(value: V, children: ReadonlyAddress<MockTreeNode<K, V>> = ImmutableAddress.empty<MockTreeNode<K, V>>()) {
    super(value, children, 'MockTreeNode');
  }
}
