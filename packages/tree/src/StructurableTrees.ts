import {
  ImmutableProject,
  MutableAddress,
  MutableProject,
  ReadonlyAddress,
  ReadonlyProject,
  ReadonlySequence
} from '@jamashita/publikum-collection';
import { Kind, Nullable } from '@jamashita/publikum-type';
import { ATrees } from './Abstract/ATrees';
import { ClosureTable } from './ClosureTable/ClosureTable';
import { ClosureTableHierarchies } from './ClosureTable/ClosureTableHierarchies';
import { ClosureTableHierarchy } from './ClosureTable/ClosureTableHierarchy';
import { TreeError } from './Error/TreeError';
import { StructurableTreeObject } from './Interface/StructurableTreeObject';
import { TreeID } from './Interface/TreeID';
import { StructurableTree } from './StructurableTree';
import { StructurableTreeNode } from './TreeNode/StructurableTreeNode';

export class StructurableTrees<K extends TreeID, V extends StructurableTreeObject<K>> extends ATrees<K, V, StructurableTreeNode<K, V>, StructurableTree<K, V>, MutableProject<K, StructurableTree<K, V>>, 'StructurableTrees'> {
  public readonly noun: 'StructurableTrees' = 'StructurableTrees';

  public static of<KT extends TreeID, VT extends StructurableTreeObject<KT>>(trees: StructurableTrees<KT, VT>): StructurableTrees<KT, VT> {
    return StructurableTrees.ofProject<KT, VT>(trees.trees);
  }

  public static ofProject<KT extends TreeID, VT extends StructurableTreeObject<KT>>(project: ReadonlyProject<KT, StructurableTree<KT, VT>>): StructurableTrees<KT, VT> {
    return StructurableTrees.ofInternal<KT, VT>(project);
  }

  public static ofInternal<KT extends TreeID, VT extends StructurableTreeObject<KT>>(project: ReadonlyProject<KT, StructurableTree<KT, VT>>): StructurableTrees<KT, VT> {
    return new StructurableTrees<KT, VT>(MutableProject.of<KT, StructurableTree<KT, VT>>(project));
  }

  public static ofTable<KT extends TreeID, VT extends StructurableTreeObject<KT>>(table: ClosureTable<KT>, values: ReadonlySequence<VT>): StructurableTrees<KT, VT> {
    if (table.isEmpty()) {
      if (values.isEmpty()) {
        return StructurableTrees.empty<KT, VT>();
      }

      throw new TreeError('CLOSURE TABLE IS EMPTY');
    }
    if (values.isEmpty()) {
      throw new TreeError('VALUES ARE EMPTY');
    }

    const vs: ReadonlyProject<KT, VT> = StructurableTrees.toProject<KT, VT>(values);
    const pool: MutableProject<KT, StructurableTreeNode<KT, VT>> = MutableProject.empty<KT, StructurableTreeNode<KT, VT>>();
    const used: MutableAddress<KT> = MutableAddress.empty<KT>();

    table.sort().toArray().forEach((key: KT) => {
      StructurableTrees.forgeInternal(key, vs, table, pool, used);
    });

    const trees: MutableProject<KT, StructurableTree<KT, VT>> = pool.map<StructurableTree<KT, VT>>((node: StructurableTreeNode<KT, VT>) => {
      return StructurableTree.of<KT, VT>(node);
    });

    return StructurableTrees.ofProject<KT, VT>(trees);
  }

  public static empty<KT extends TreeID, VT extends StructurableTreeObject<KT>>(): StructurableTrees<KT, VT> {
    return StructurableTrees.ofProject<KT, VT>(ImmutableProject.empty<KT, StructurableTree<KT, VT>>());
  }

  private static toProject<KT extends TreeID, VT extends StructurableTreeObject<KT>>(sequence: ReadonlySequence<VT>): ReadonlyProject<KT, VT> {
    const project: MutableProject<KT, VT> = MutableProject.empty<KT, VT>();

    sequence.forEach((v: VT) => {
      project.set(v.getTreeID(), v);
    });

    return project;
  }

  private static forgeInternal<KT extends TreeID, VT extends StructurableTreeObject<KT>>(key: KT, values: ReadonlyProject<KT, VT>, table: ClosureTable<KT>, pool: MutableProject<KT, StructurableTreeNode<KT, VT>>, used: MutableAddress<KT>): StructurableTreeNode<KT, VT> {
    const value: Nullable<VT> = values.get(key);

    if (Kind.isNull(value)) {
      throw new TreeError(`THIS KEY DOES NOT HAVE VALUE. GIVEN: ${key.toString()}`);
    }

    const n: Nullable<StructurableTreeNode<KT, VT>> = pool.get(key);

    if (!Kind.isNull(n)) {
      pool.remove(key);
      used.add(key);

      return n;
    }

    const children: Nullable<ReadonlyAddress<KT>> = table.get(key);

    if (Kind.isNull(children)) {
      throw new TreeError(`CLOSURE TABLE DOES NOT CONTAIN THIS KEY. GIVEN: ${key.toString()}`);
    }

    const address: MutableAddress<StructurableTreeNode<KT, VT>> = MutableAddress.empty<StructurableTreeNode<KT, VT>>();

    children.forEach((k: KT) => {
      if (k.equals(key)) {
        return;
      }
      if (used.contains(k)) {
        return;
      }

      address.add(StructurableTrees.forgeInternal<KT, VT>(k, values, table, pool, used));
    });

    const node: StructurableTreeNode<KT, VT> = StructurableTreeNode.ofValue<KT, VT>(value, address);

    pool.set(key, node);

    return node;
  }

  protected constructor(trees: MutableProject<K, StructurableTree<K, V>>) {
    super(trees);
  }

  public add(tree: StructurableTree<K, V>): StructurableTrees<K, V> {
    this.trees.set(tree.getTreeID(), tree);

    return this;
  }

  public has(key: K): boolean {
    return this.trees.some((tree: StructurableTree<K, V>) => {
      return tree.has(key);
    });
  }

  public toHierarchies(): ClosureTableHierarchies<K> {
    const hierarchies: Array<ClosureTableHierarchy<K>> = [];

    this.trees.forEach((tree: StructurableTree<K, V>) => {
      hierarchies.push(...tree.toHierarchies().values());
    });

    return ClosureTableHierarchies.ofArray<K>(hierarchies);
  }
}
