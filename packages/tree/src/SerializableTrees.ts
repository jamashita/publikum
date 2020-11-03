import { ImmutableAddress, ReadonlyAddress } from '@jamashita/publikum-collection';
import { JSONable } from '@jamashita/publikum-interface';
import { ATrees } from './ATrees';
import { SerializableTreeObject } from './Interface/SerializableTreeObject';
import { SerializableTree } from './SerializableTree';
import { SerializableTreeNode, TreeNodeJSON } from './TreeNode/SerializableTreeNode';

export class SerializableTrees<V extends SerializableTreeObject> extends ATrees<void, V, SerializableTreeNode<V>, SerializableTree<V>, ReadonlyAddress<SerializableTree<V>>, 'SerializableTrees'> implements JSONable<ReadonlyArray<TreeNodeJSON>> {
  public readonly noun: 'SerializableTrees' = 'SerializableTrees';

  public static of<VT extends SerializableTreeObject>(trees: SerializableTrees<VT>): SerializableTrees<VT> {
    return SerializableTrees.ofAddress<VT>(trees.trees);
  }

  public static ofAddress<VT extends SerializableTreeObject>(address: ReadonlyAddress<SerializableTree<VT>>): SerializableTrees<VT> {
    return new SerializableTrees<VT>(address);
  }

  protected constructor(trees: ReadonlyAddress<SerializableTree<V>>) {
    super(ImmutableAddress.of<SerializableTree<V>>(trees));
  }


  public toJSON(): ReadonlyArray<TreeNodeJSON> {
    const json: Array<TreeNodeJSON> = [];

    this.trees.forEach((tree: SerializableTree<V>) => {
      json.push(tree.toJSON());
    });

    return json;
  }
}
