import { JSONable } from '@jamashita/publikum-interface';
import { SerializableTreeObject } from './Interface/SerializableTreeObject';
import { Tree } from './Tree';
import { SerializableTreeNode, TreeNodeJSON } from './TreeNode/SerializableTreeNode';

export class SerializableTree<V extends SerializableTreeObject> extends Tree<V, SerializableTreeNode<V>, 'SerializableTree'> implements JSONable<TreeNodeJSON> {
  public readonly noun: 'SerializableTree' = 'SerializableTree';

  public static of<VT extends SerializableTreeObject>(root: SerializableTreeNode<VT>): SerializableTree<VT> {
    return new SerializableTree<VT>(root);
  }

  protected constructor(root: SerializableTreeNode<V>) {
    super(root);
  }

  public toJSON(): TreeNodeJSON {
    return this.root.toJSON();
  }
}
