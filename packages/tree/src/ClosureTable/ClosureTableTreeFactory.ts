import { MutableAddress, MutableProject, ReadonlyProject } from '@jamashita/publikum-collection';
import { Kind, Nullable } from '@jamashita/publikum-type';
import { TreeError } from '../Error/TreeError';
import { StructurableTreeObject } from '../Interface/StructurableTreeObject';
import { TreeID } from '../Interface/TreeID';
import { StructurableTree } from '../StructurableTree';
import { StructurableTreeNode } from '../TreeNode/StructurableTreeNode';
import { ClosureTable } from './ClosureTable';
import { ClosureTableOffsprings } from './ClosureTableOffsprings';

// FIXME still weird, should rename to StructurableTreFactory
export class ClosureTableTreeFactory<K extends TreeID, V extends StructurableTreeObject<K>> {
  // TODO ARGS CHANGED
  public forge(table: ClosureTable<K>, values: ReadonlyProject<K, V>): MutableProject<K, StructurableTree<K, V>> {
    if (table.isEmpty()) {
      throw new TreeError('THIS CLOSURE TABLE IS EMPTY');
    }
    if (values.isEmpty()) {
      throw new TreeError('VALUES ARE EMPTY');
    }

    const pool: MutableProject<K, StructurableTreeNode<K, V>> = MutableProject.empty<K, StructurableTreeNode<K, V>>();
    const used: MutableAddress<K> = MutableAddress.empty<K>();
    const array: ReadonlyArray<StructurableTreeNode<K, V>> = table.sort().toArray().map<Nullable<StructurableTreeNode<K, V>>>((key: K) => {
      return this.forgeInternal(key, values, pool, used, table);
    }).filter<StructurableTreeNode<K, V>>((node: Nullable<StructurableTreeNode<K, V>>): node is StructurableTreeNode<K, V> => {
      return !Kind.isNull(node);
    });

    const project: MutableProject<K, StructurableTree<K, V>> = MutableProject.empty<K, StructurableTree<K, V>>();

    array.forEach((node: StructurableTreeNode<K, V>) => {
      project.set(node.getTreeID(), StructurableTree.of<K, V>(node));
    });

    return project;
  }

  private forgeInternal(key: K, values: ReadonlyProject<K, V>, pool: MutableProject<K, StructurableTreeNode<K, V>>, used: MutableAddress<K>, table: ClosureTable<K>): Nullable<StructurableTreeNode<K, V>> {
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

    const offsprings: ClosureTableOffsprings<K> = table.get(key) as ClosureTableOffsprings<K>;
    const address: MutableAddress<StructurableTreeNode<K, V>> = MutableAddress.empty<StructurableTreeNode<K, V>>();

    offsprings.forEach((child: K) => {
      if (key.equals(child)) {
        return;
      }

      const node: Nullable<StructurableTreeNode<K, V>> = this.forgeInternal(child, values, pool, used, table);

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
