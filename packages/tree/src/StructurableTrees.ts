import {
  MutableAddress,
  MutableProject,
  ReadonlyAddress,
  ReadonlyProject,
  ReadonlySequence
} from '@jamashita/publikum-collection';
import { Kind, Nullable } from '@jamashita/publikum-type';
import { ATrees } from './ATrees';
import { ClosureTable } from './ClosureTable/ClosureTable';
import { TreeError } from './Error/TreeError';
import { StructurableTreeObject } from './Interface/StructurableTreeObject';
import { TreeID } from './Interface/TreeID';
import { StructurableTree } from './StructurableTree';
import { StructurableTreeNode } from './TreeNode/StructurableTreeNode';

export class StructurableTrees<K extends TreeID, V extends StructurableTreeObject<K>> extends ATrees<K, V, StructurableTreeNode<K, V>, StructurableTree<K, V>, ReadonlyProject<K, StructurableTree<K, V>>, 'StructurableTrees'> {
  public readonly noun: 'StructurableTrees' = 'StructurableTrees';

  public static of<KT extends TreeID, VT extends StructurableTreeObject<KT>>(trees: StructurableTrees<KT, VT>): StructurableTrees<KT, VT> {
    return StructurableTrees.ofProject<KT, VT>(trees.trees);
  }

  public static ofProject<KT extends TreeID, VT extends StructurableTreeObject<KT>>(project: ReadonlyProject<KT, StructurableTree<KT, VT>>): StructurableTrees<KT, VT> {
    return new StructurableTrees<KT, VT>(project);
  }

  // TODO YABAI
  public static ofTable<KT extends TreeID, VT extends StructurableTreeObject<KT>>(table: ClosureTable<KT>, values: ReadonlySequence<VT>): StructurableTrees<KT, VT> {
    if (table.isEmpty()) {
      throw new TreeError('THIS CLOSURE TABLE IS EMPTY');
    }
    if (values.isEmpty()) {
      throw new TreeError('VALUES ARE EMPTY');
    }

    const vs: ReadonlyProject<KT, VT> = StructurableTrees.toProject<KT, VT>(values);
    const pool: MutableProject<KT, StructurableTreeNode<KT, VT>> = MutableProject.empty<KT, StructurableTreeNode<KT, VT>>();
    const used: MutableAddress<KT> = MutableAddress.empty<KT>();
    const array: ReadonlyArray<StructurableTreeNode<KT, VT>> = table.sort().toArray().map<Nullable<StructurableTreeNode<KT, VT>>>((key: KT) => {
      return StructurableTrees.forgeInternal(key, vs, table, pool, used);
    }).filter<StructurableTreeNode<KT, VT>>((node: Nullable<StructurableTreeNode<KT, VT>>): node is StructurableTreeNode<KT, VT> => {
      return !Kind.isNull(node);
    });

    const project: MutableProject<KT, StructurableTree<KT, VT>> = MutableProject.empty<KT, StructurableTree<KT, VT>>();

    array.forEach((node: StructurableTreeNode<KT, VT>) => {
      project.set(node.getTreeID(), StructurableTree.of<KT, VT>(node));
    });

    return StructurableTrees.ofProject<KT, VT>(project);
  }

  private static toProject<KT extends TreeID, VT extends StructurableTreeObject<KT>>(sequence: ReadonlySequence<VT>): ReadonlyProject<KT, VT> {
    const project: MutableProject<KT, VT> = MutableProject.empty<KT, VT>();

    sequence.forEach((v: VT) => {
      project.set(v.getTreeID(), v);
    });

    return project;
  }

  private static forgeInternal<KT extends TreeID, VT extends StructurableTreeObject<KT>>(key: KT, values: ReadonlyProject<KT, VT>, table: ClosureTable<KT>, pool: MutableProject<KT, StructurableTreeNode<KT, VT>>, used: MutableAddress<KT>): Nullable<StructurableTreeNode<KT, VT>> {
    const already: Nullable<StructurableTreeNode<KT, VT>> = pool.get(key);

    if (!Kind.isNull(already)) {
      pool.remove(key);

      return already;
    }
    if (used.contains(key)) {
      return null;
    }

    const value: Nullable<VT> = values.get(key);

    if (Kind.isNull(value)) {
      throw new TreeError(`THIS KEY DOES NOT HAVE VALUE. GIVEN: ${key.toString()}`);
    }

    const offsprings: ReadonlyAddress<KT> = table.get(key) as ReadonlyAddress<KT>;
    const address: MutableAddress<StructurableTreeNode<KT, VT>> = MutableAddress.empty<StructurableTreeNode<KT, VT>>();

    offsprings.forEach((child: KT) => {
      if (key.equals(child)) {
        return;
      }

      const node: Nullable<StructurableTreeNode<KT, VT>> = StructurableTrees.forgeInternal<KT, VT>(child, values, table, pool, used);

      if (Kind.isNull(node)) {
        return;
      }

      address.add(node);
    });

    const newNode: StructurableTreeNode<KT, VT> = StructurableTreeNode.ofValue<KT, VT>(value, address);

    pool.set(key, newNode);
    used.add(key);

    return newNode;
  }

  protected constructor(trees: ReadonlyProject<K, StructurableTree<K, V>>) {
    super(trees);
  }

  public has(key: K): boolean {
    const t: Nullable<StructurableTree<K, V>> = this.trees.get(key);

    if (Kind.isNull(t)) {
      return false;
    }

    return true;
  }
}
