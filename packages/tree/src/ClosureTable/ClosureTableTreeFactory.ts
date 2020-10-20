import { MutableAddress, MutableProject, ReadonlyProject } from '@jamashita/publikum-collection';
import { Kind, Nullable } from '@jamashita/publikum-type';
import { TreeError } from '../Error/TreeError';
import { StructurableTreeObject } from '../Interface/StructurableTreeObject';
import { TreeID } from '../Interface/TreeID';
import { StructurableTree } from '../StructurableTree';
import { StructurableTreeNode } from '../TreeNode/StructurableTreeNode';
import { ClosureTable } from './ClosureTable';
import { ClosureTableOffsprings } from './ClosureTableOffsprings';

export class ClosureTableTreeFactory<K extends TreeID, V extends StructurableTreeObject<K>> {
  private readonly table: ClosureTable<K>;

  public static of<KT extends TreeID, VT extends StructurableTreeObject<KT>>(table: ClosureTable<KT>): ClosureTableTreeFactory<KT, VT> {
    if (table.isEmpty()) {
      throw new TreeError('THIS CLOSURE TABLE IS EMPTY');
    }

    return new ClosureTableTreeFactory<KT, VT>(table);
  }

  protected constructor(table: ClosureTable<K>) {
    this.table = table;
  }

  public forge(values: ReadonlyProject<K, V>): MutableProject<K, StructurableTree<K, V>> {
    if (values.isEmpty()) {
      throw new TreeError('VALUES ARE EMPTY');
    }

    const pool: MutableProject<K, StructurableTreeNode<K, V>> = MutableProject.empty<K, StructurableTreeNode<K, V>>();
    const used: MutableAddress<K> = MutableAddress.empty<K>();
    const array: ReadonlyArray<StructurableTreeNode<K, V>> = this.table.sort().toArray().map<Nullable<StructurableTreeNode<K, V>>>((key: K) => {
      return this.forgeInternal(key, values, pool, used);
    }).filter<StructurableTreeNode<K, V>>((node: Nullable<StructurableTreeNode<K, V>>): node is StructurableTreeNode<K, V> => {
      return !Kind.isNull(node);
    });

    if (array.length === 0) {
      throw new TreeError('NO TREE BUILT');
    }

    const project: MutableProject<K, StructurableTree<K, V>> = MutableProject.empty<K, StructurableTree<K, V>>();

    array.forEach((node: StructurableTreeNode<K, V>) => {
      project.set(node.getTreeID(), StructurableTree.of<K, V>(node));
    });

    return project;
  }

  private forgeInternal(key: K, values: ReadonlyProject<K, V>, pool: MutableProject<K, StructurableTreeNode<K, V>>, used: MutableAddress<K>): Nullable<StructurableTreeNode<K, V>> {
    const already: Nullable<StructurableTreeNode<K, V>> = pool.get(key);

    if (!Kind.isNull(already)) {
      pool.remove(key);

      return already;
    }
    if (used.contains(key)) {
      return null;
    }

    const value: Nullable<V> = values.get(key);

    if (Kind.isNull(value)) {
      throw new TreeError(`THIS KEY DOES NOT HAVE VALUE. GIVEN: ${key.toString()}`);
    }

    const offsprings: ClosureTableOffsprings<K> = this.table.get(key) as ClosureTableOffsprings<K>;
    const address: MutableAddress<StructurableTreeNode<K, V>> = MutableAddress.empty<StructurableTreeNode<K, V>>();

    offsprings.forEach((child: K) => {
      if (key.equals(child)) {
        return;
      }

      const node: Nullable<StructurableTreeNode<K, V>> = this.forgeInternal(child, values, pool, used);

      if (Kind.isNull(node)) {
        return;
      }

      address.add(node);
    });

    const newNode: StructurableTreeNode<K, V> = StructurableTreeNode.of<K, V>(value, address);

    pool.set(key, newNode);
    used.add(key);

    return newNode;
  }
}
