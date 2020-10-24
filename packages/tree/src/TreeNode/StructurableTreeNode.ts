import { ImmutableAddress, ReadonlyAddress } from '@jamashita/publikum-collection';
import { StructurableTreeObject } from '../Interface/StructurableTreeObject';
import { TreeID } from '../Interface/TreeID';
import { ATreeNode } from './Abstract/ATreeNode';

export class StructurableTreeNode<K extends TreeID, V extends StructurableTreeObject<K>> extends ATreeNode<V, StructurableTreeNode<K, V>, 'StructurableTreeNode'> {
  public static of<KT extends TreeID, VT extends StructurableTreeObject<KT>>(value: VT, children: ReadonlyAddress<StructurableTreeNode<KT, VT>> = ImmutableAddress.empty<StructurableTreeNode<KT, VT>>()): StructurableTreeNode<KT, VT> {
    return new StructurableTreeNode<KT, VT>(value, ImmutableAddress.of<StructurableTreeNode<KT, VT>>(children));
  }

  public static ofNode<KT extends TreeID, VT extends StructurableTreeObject<KT>>(node: StructurableTreeNode<KT, VT>): StructurableTreeNode<KT, VT> {
    return StructurableTreeNode.of<KT, VT>(node.getValue(), node.getChildren());
  }

  protected constructor(value: V, children: ReadonlyAddress<StructurableTreeNode<K, V>>) {
    super(value, children, 'StructurableTreeNode');
  }

  protected forge(self: ATreeNode<V, StructurableTreeNode<K, V>>): StructurableTreeNode<K, V> {
    if (self instanceof StructurableTreeNode) {
      return self as StructurableTreeNode<K, V>;
    }

    return StructurableTreeNode.of<K, V>(self.getValue(), self.getChildren());
  }

  public getTreeID(): K {
    return this.value.getTreeID();
  }
}
