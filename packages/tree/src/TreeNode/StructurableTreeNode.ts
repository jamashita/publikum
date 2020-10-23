import { ImmutableAddress, ReadonlyAddress } from '@jamashita/publikum-collection';
import { StructurableTreeObject } from '../Interface/StructurableTreeObject';
import { TreeID } from '../Interface/TreeID';
import { ATreeNode } from './Abstract/ATreeNode';

export class StructurableTreeNode<K extends TreeID, V extends StructurableTreeObject<K>> extends ATreeNode<V, StructurableTreeNode<K, V>, 'StructurableTreeNode'> {
  public static of<KT extends TreeID, VT extends StructurableTreeObject<KT>>(value: VT, children: ReadonlyAddress<StructurableTreeNode<KT, VT>> = ImmutableAddress.empty<StructurableTreeNode<KT, VT>>()): StructurableTreeNode<KT, VT> {
    return new StructurableTreeNode<KT, VT>(value, ImmutableAddress.of<StructurableTreeNode<KT, VT>>(children));
  }

  protected constructor(value: V, children: ReadonlyAddress<StructurableTreeNode<K, V>>) {
    super(value, children, 'StructurableTreeNode');
  }

  public getTreeID(): K {
    return this.value.getTreeID();
  }
}
