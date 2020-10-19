import { ImmutableAddress, ReadonlyAddress } from '@jamashita/publikum-collection';
import { JSONable } from '@jamashita/publikum-interface';
import { ObjectLiteral } from '@jamashita/publikum-type';
import { SerializableTreeObject } from '../Interface/SerializableTreeObject';
import { ATreeNode } from './ATreeNode';

export type TreeNodeJSON = Readonly<{
  value: ObjectLiteral;
  children: ReadonlyArray<ObjectLiteral>;
}>;

export class SerializableTreeNode<V extends SerializableTreeObject> extends ATreeNode<V, SerializableTreeNode<V>, 'SerializableTreeNode'> implements JSONable<TreeNodeJSON> {
  public static of<VT extends SerializableTreeObject>(value: VT, children: ReadonlyAddress<SerializableTreeNode<VT>>): SerializableTreeNode<VT> {
    if (children.isEmpty()) {
      return new SerializableTreeNode<VT>(value, ImmutableAddress.empty<SerializableTreeNode<VT>>());
    }

    return new SerializableTreeNode<VT>(value, ImmutableAddress.of<SerializableTreeNode<VT>>(children));
  }

  protected constructor(value: V, children: ReadonlyAddress<SerializableTreeNode<V>>) {
    super(value, children, 'SerializableTreeNode');
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
