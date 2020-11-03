import { ImmutableSequence } from '@jamashita/publikum-collection';
import { Nullable } from '@jamashita/publikum-type';
import { ClosureTable } from '../ClosureTable/ClosureTable';
import { MockClosureTableHierarchies } from '../ClosureTable/Mock/MockClosureTableHierarchies';
import { MockClosureTableHierarchy } from '../ClosureTable/Mock/MockClosureTableHierarchy';
import { TreeError } from '../Error/TreeError';
import { MockTreeID } from '../Mock/MockTreeID';
import { MockTreeObject } from '../Mock/MockTreeObject';
import { StructurableTree } from '../StructurableTree';
import { StructurableTrees } from '../StructurableTrees';
import { StructurableTreeNode } from '../TreeNode/StructurableTreeNode';

describe('StructurableTrees', () => {
  describe('ofTable', () => {
    it('throws TreeError when empty ClosureTable<MockTreeID> given', () => {
      expect.assertions(1);

      const id: MockTreeID = new MockTreeID('id 1');

      const table: ClosureTable<MockTreeID> = ClosureTable.empty<MockTreeID>();
      const values: ImmutableSequence<MockTreeObject<MockTreeID>> = ImmutableSequence.ofArray<MockTreeObject<MockTreeID>>([
        new MockTreeObject<MockTreeID>(id)
      ]);

      expect(() => {
        StructurableTrees.ofTable<MockTreeID, MockTreeObject<MockTreeID>>(table, values);
      }).toThrow(TreeError);
    });

    it('throws TreeError when empty Project<MockTreeID, MockTreeObject<MockTreeID>> given', () => {
      expect.assertions(1);

      const id: MockTreeID = new MockTreeID('id 1');

      const table: ClosureTable<MockTreeID> = ClosureTable.of<MockTreeID>(
        new MockClosureTableHierarchies<MockTreeID>(
          new MockClosureTableHierarchy<MockTreeID>(id, id)
        )
      );
      const values: ImmutableSequence<MockTreeObject<MockTreeID>> = ImmutableSequence.empty<MockTreeObject<MockTreeID>>();

      expect(() => {
        StructurableTrees.ofTable<MockTreeID, MockTreeObject<MockTreeID>>(table, values);
      }).toThrow(TreeError);
    });

    it('throws TreeError when values do not have such key', () => {
      expect.assertions(1);

      const id1: MockTreeID = new MockTreeID('id 1');
      const id2: MockTreeID = new MockTreeID('id 2');

      const table: ClosureTable<MockTreeID> = ClosureTable.of<MockTreeID>(
        new MockClosureTableHierarchies<MockTreeID>(
          new MockClosureTableHierarchy<MockTreeID>(id1, id1)
        )
      );
      const values: ImmutableSequence<MockTreeObject<MockTreeID>> = ImmutableSequence.ofArray<MockTreeObject<MockTreeID>>([
        new MockTreeObject<MockTreeID>(id2)
      ]);

      expect(() => {
        StructurableTrees.ofTable<MockTreeID, MockTreeObject<MockTreeID>>(table, values);
      }).toThrow(TreeError);
    });

    it('returns one simplest flat Tree', () => {
      expect.assertions(5);

      const id: MockTreeID = new MockTreeID('id 1');

      const table: ClosureTable<MockTreeID> = ClosureTable.of<MockTreeID>(
        new MockClosureTableHierarchies<MockTreeID>(
          new MockClosureTableHierarchy<MockTreeID>(id, id)
        )
      );
      const values: ImmutableSequence<MockTreeObject<MockTreeID>> = ImmutableSequence.ofArray<MockTreeObject<MockTreeID>>([
        new MockTreeObject<MockTreeID>(id)
      ]);

      const trees: StructurableTrees<MockTreeID, MockTreeObject<MockTreeID>> = StructurableTrees.ofTable<MockTreeID, MockTreeObject<MockTreeID>>(table, values);

      expect(trees.size()).toBe(1);

      const tree: Nullable<StructurableTree<MockTreeID, MockTreeObject<MockTreeID>>> = trees.get(id);

      expect(tree).not.toBeNull();
      expect(tree?.getRoot().size()).toBe(1);
      expect(tree?.getRoot().getTreeID()).toBe(id);
      expect(tree?.getRoot().getChildren().size()).toBe(0);
    });

    it('returns 2 or more simplest flat Trees', () => {
      expect.assertions(9);

      const id1: MockTreeID = new MockTreeID('id 1');
      const id2: MockTreeID = new MockTreeID('id 2');

      const table: ClosureTable<MockTreeID> = ClosureTable.of<MockTreeID>(
        new MockClosureTableHierarchies<MockTreeID>(
          new MockClosureTableHierarchy<MockTreeID>(id1, id1),
          new MockClosureTableHierarchy<MockTreeID>(id2, id2)
        )
      );
      const values: ImmutableSequence<MockTreeObject<MockTreeID>> = ImmutableSequence.ofArray<MockTreeObject<MockTreeID>>([
        new MockTreeObject<MockTreeID>(id1),
        new MockTreeObject<MockTreeID>(id2)
      ]);

      const trees: StructurableTrees<MockTreeID, MockTreeObject<MockTreeID>> = StructurableTrees.ofTable<MockTreeID, MockTreeObject<MockTreeID>>(table, values);

      expect(trees.size()).toBe(2);

      const tree1: Nullable<StructurableTree<MockTreeID, MockTreeObject<MockTreeID>>> = trees.get(id1);

      expect(tree1).not.toBeNull();
      expect(tree1?.getRoot().size()).toBe(1);
      expect(tree1?.getRoot().getTreeID()).toBe(id1);
      expect(tree1?.getRoot().getChildren().size()).toBe(0);

      const tree2: Nullable<StructurableTree<MockTreeID, MockTreeObject<MockTreeID>>> = trees.get(id1);

      expect(tree2).not.toBeNull();
      expect(tree2?.getRoot().size()).toBe(1);
      expect(tree2?.getRoot().getTreeID()).toBe(id1);
      expect(tree2?.getRoot().getChildren().size()).toBe(0);
    });

    it('returns one complex Tree', () => {
      expect.assertions(11);

      const id1: MockTreeID = new MockTreeID('id 1');
      const id2: MockTreeID = new MockTreeID('id 2');
      const id3: MockTreeID = new MockTreeID('id 3');
      const id4: MockTreeID = new MockTreeID('id 4');

      const table: ClosureTable<MockTreeID> = ClosureTable.of<MockTreeID>(
        new MockClosureTableHierarchies<MockTreeID>(
          new MockClosureTableHierarchy<MockTreeID>(id1, id1),
          new MockClosureTableHierarchy<MockTreeID>(id2, id2),
          new MockClosureTableHierarchy<MockTreeID>(id3, id3),
          new MockClosureTableHierarchy<MockTreeID>(id4, id4),
          new MockClosureTableHierarchy<MockTreeID>(id1, id2),
          new MockClosureTableHierarchy<MockTreeID>(id1, id3),
          new MockClosureTableHierarchy<MockTreeID>(id1, id4),
          new MockClosureTableHierarchy<MockTreeID>(id3, id4)
        )
      );
      const values: ImmutableSequence<MockTreeObject<MockTreeID>> = ImmutableSequence.ofArray<MockTreeObject<MockTreeID>>([
        new MockTreeObject<MockTreeID>(id1),
        new MockTreeObject<MockTreeID>(id2),
        new MockTreeObject<MockTreeID>(id3),
        new MockTreeObject<MockTreeID>(id4)
      ]);

      const trees: StructurableTrees<MockTreeID, MockTreeObject<MockTreeID>> = StructurableTrees.ofTable<MockTreeID, MockTreeObject<MockTreeID>>(table, values);

      expect(trees.size()).toBe(4);

      const tree: Nullable<StructurableTree<MockTreeID, MockTreeObject<MockTreeID>>> = trees.get(id1);

      if (tree === null) {
        fail();

        return;
      }

      const root: StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>> = tree.getRoot();

      expect(root.size()).toBe(4);
      expect(root.getTreeID()).toBe(id1);
      expect(root.getChildren().size()).toBe(2);

      let i: number = 0;

      for (const p of root.getChildren()) {
        switch (i) {
          case 0: {
            expect(p.getValue().getTreeID()).toBe(id2);
            expect(p.getValue().isLeaf()).toBe(true);

            break;
          }
          case 1: {
            expect(p.getValue().getTreeID()).toBe(id3);
            expect(p.getValue().isLeaf()).toBe(false);

            expect(p.getValue().getChildren().size()).toBe(1);

            for (const pp of p.getValue().getChildren()) {
              expect(pp.getValue().getTreeID()).toBe(id4);
              expect(pp.getValue().isLeaf()).toBe(true);
            }

            break;
          }
          default: {
            fail();

            return;

          }
        }
        i++;
      }
    });
  });

  describe('has', () => {
    it('returns true if given key exists', () => {
      expect.assertions(6);

      const id1: MockTreeID = new MockTreeID('id 1');
      const id2: MockTreeID = new MockTreeID('id 2');
      const id3: MockTreeID = new MockTreeID('id 3');
      const id4: MockTreeID = new MockTreeID('id 4');
      const id5: MockTreeID = new MockTreeID('id 5');
      const id6: MockTreeID = new MockTreeID('id 6');

      const table: ClosureTable<MockTreeID> = ClosureTable.of<MockTreeID>(
        new MockClosureTableHierarchies<MockTreeID>(
          new MockClosureTableHierarchy<MockTreeID>(id1, id1),
          new MockClosureTableHierarchy<MockTreeID>(id2, id2),
          new MockClosureTableHierarchy<MockTreeID>(id3, id3),
          new MockClosureTableHierarchy<MockTreeID>(id4, id4),
          new MockClosureTableHierarchy<MockTreeID>(id1, id2),
          new MockClosureTableHierarchy<MockTreeID>(id1, id3),
          new MockClosureTableHierarchy<MockTreeID>(id1, id4),
          new MockClosureTableHierarchy<MockTreeID>(id3, id4),
          new MockClosureTableHierarchy<MockTreeID>(id5, id5)
        )
      );
      const values: ImmutableSequence<MockTreeObject<MockTreeID>> = ImmutableSequence.ofArray<MockTreeObject<MockTreeID>>([
        new MockTreeObject<MockTreeID>(id1),
        new MockTreeObject<MockTreeID>(id2),
        new MockTreeObject<MockTreeID>(id3),
        new MockTreeObject<MockTreeID>(id4),
        new MockTreeObject<MockTreeID>(id5)
      ]);

      const trees: StructurableTrees<MockTreeID, MockTreeObject<MockTreeID>> = StructurableTrees.ofTable<MockTreeID, MockTreeObject<MockTreeID>>(table, values);

      expect(trees.has(id1)).toBe(true);
      expect(trees.has(id2)).toBe(true);
      expect(trees.has(id3)).toBe(true);
      expect(trees.has(id4)).toBe(true);
      expect(trees.has(id5)).toBe(true);
      expect(trees.has(id6)).toBe(false);
    });
  });
});
