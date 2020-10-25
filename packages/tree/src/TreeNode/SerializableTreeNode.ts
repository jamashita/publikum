import { ImmutableAddress, ReadonlyAddress } from '@jamashita/publikum-collection';
import { JSONable } from '@jamashita/publikum-interface';
import { ObjectLiteral } from '@jamashita/publikum-type';
import { SerializableTreeObject } from '../Interface/SerializableTreeObject';
import { TreeNode } from './TreeNode';

export type TreeNodeJSON = Readonly<{
  value: ObjectLiteral;
  children: ReadonlyArray<ObjectLiteral>;
}>;

export class SerializableTreeNode<V extends SerializableTreeObject> extends TreeNode<V, SerializableTreeNode<V>, 'SerializableTreeNode'> implements JSONable<TreeNodeJSON> {
  public readonly noun: 'SerializableTreeNode' = 'SerializableTreeNode';

  public static of<VT extends SerializableTreeObject>(value: VT, children: ReadonlyAddress<SerializableTreeNode<VT>> = ImmutableAddress.empty<SerializableTreeNode<VT>>()): SerializableTreeNode<VT> {
    return new SerializableTreeNode<VT>(value, ImmutableAddress.of<SerializableTreeNode<VT>>(children));
  }

  public static ofNode<VT extends SerializableTreeObject>(node: SerializableTreeNode<VT>): SerializableTreeNode<VT> {
    return new SerializableTreeNode<VT>(node.getValue(), node.getChildren());
  }

  protected constructor(value: V, children: ImmutableAddress<SerializableTreeNode<V>>) {
    super(value, children);
  }

  protected forge(node: TreeNode<V, SerializableTreeNode<V>>): SerializableTreeNode<V> {
    if (node instanceof SerializableTreeNode) {
      return node as SerializableTreeNode<V>;
    }

    return SerializableTreeNode.of<V>(node.getValue(), node.getChildren());
  }

  public toJSON(): TreeNodeJSON {
    const children: Array<ObjectLiteral> = [];

    this.children.forEach((child: SerializableTreeNode<V>) => {
      children.push(child.toJSON());
    });

    return {
      value: this.value.toJSON(),
      children
    };
  }
}
