import { ImmutableProject, MutableProject, Pair, Project, ReadonlyAddress } from '@jamashita/publikum-collection';
import { StructurableTreeNode } from '@jamashita/publikum-tree';
import { Nullable } from '@jamashita/publikum-type';
import { TreeError } from '../../Error/TreeError';
import { MockTreeID } from '../../Mock/MockTreeID';
import { MockTreeObject } from '../../Mock/MockTreeObject';
import { StructurableTree } from '../../StructurableTree';
import { ClosureTable } from '../ClosureTable';
import { ClosureTableTreeFactory } from '../ClosureTableTreeFactory';
import { MockClosureTable } from '../Mock/MockClosureTable';
import { MockClosureTableHierarchy } from '../Mock/MockClosureTableHierarchy';

describe('ClosureTableTreeFactory', () => {
  describe('of', () => {
    it('throws TreeError when empty ClosureTable given', () => {
      expect.assertions(1);

      const table: MockClosureTable<MockTreeID> = new MockClosureTable<MockTreeID>();

      expect(() => {
        ClosureTableTreeFactory.of<MockTreeID, MockTreeObject<MockTreeID>>(table);
      }).toThrow(TreeError);
    });

    it('returns instance', () => {
      expect.assertions(1);

      const table: MockClosureTable<MockTreeID> = new MockClosureTable<MockTreeID>(
        new MockClosureTableHierarchy<MockTreeID>(new MockTreeID('A'), new MockTreeID('A'))
      );

      expect(() => {
        ClosureTableTreeFactory.of<MockTreeID, MockTreeObject<MockTreeID>>(table);
      }).not.toThrow(TreeError);
    });
  });

  describe('forge', () => {
    it('throws TreeError when empty values given', () => {
      expect.assertions(1);

      const table: MockClosureTable<MockTreeID> = new MockClosureTable<MockTreeID>(
        new MockClosureTableHierarchy<MockTreeID>(new MockTreeID('A'), new MockTreeID('A'))
      );

      const factory: ClosureTableTreeFactory<MockTreeID, MockTreeObject<MockTreeID>> = ClosureTableTreeFactory.of<MockTreeID, MockTreeObject<MockTreeID>>(table);
      const project: Project<MockTreeID, MockTreeObject<MockTreeID>> = ImmutableProject.empty<MockTreeID, MockTreeObject<MockTreeID>>();

      expect(() => {
        factory.forge(project);
      }).toThrow(TreeError);
    });

    it('returns simplest tree', () => {
      expect.assertions(3);

      const table: MockClosureTable<MockTreeID> = new MockClosureTable<MockTreeID>(
        new MockClosureTableHierarchy<MockTreeID>(new MockTreeID('A'), new MockTreeID('A'))
      );

      const factory: ClosureTableTreeFactory<MockTreeID, MockTreeObject<MockTreeID>> = ClosureTableTreeFactory.of<MockTreeID, MockTreeObject<MockTreeID>>(table);
      const project: ImmutableProject<MockTreeID, MockTreeObject<MockTreeID>> = ImmutableProject.ofMap<MockTreeID, MockTreeObject<MockTreeID>>(new Map<MockTreeID, MockTreeObject<MockTreeID>>([
        [new MockTreeID('A'), new MockTreeObject(new MockTreeID('mock 1'))]
      ]));

      const trees: MutableProject<MockTreeID, StructurableTree<MockTreeID, MockTreeObject<MockTreeID>>> = factory.forge(project);

      expect(trees.size()).toBe(1);
      expect(trees.get(new MockTreeID('mock 1'))?.getRoot().isLeaf()).toBe(true);
      expect(trees.get(new MockTreeID('mock 1'))?.getRoot().getValue().toString()).toBe('mock 1');
    });

    it('returns complex tree', () => {
      expect.assertions(12);

      const table: MockClosureTable<MockTreeID> = new MockClosureTable<MockTreeID>(
        new MockClosureTableHierarchy<MockTreeID>(new MockTreeID('A'), new MockTreeID('A')),
        new MockClosureTableHierarchy<MockTreeID>(new MockTreeID('A'), new MockTreeID('B')),
        new MockClosureTableHierarchy<MockTreeID>(new MockTreeID('A'), new MockTreeID('C')),
        new MockClosureTableHierarchy<MockTreeID>(new MockTreeID('A'), new MockTreeID('D')),
        new MockClosureTableHierarchy<MockTreeID>(new MockTreeID('A'), new MockTreeID('E')),
        new MockClosureTableHierarchy<MockTreeID>(new MockTreeID('B'), new MockTreeID('B')),
        new MockClosureTableHierarchy<MockTreeID>(new MockTreeID('C'), new MockTreeID('C')),
        new MockClosureTableHierarchy<MockTreeID>(new MockTreeID('C'), new MockTreeID('D')),
        new MockClosureTableHierarchy<MockTreeID>(new MockTreeID('C'), new MockTreeID('E')),
        new MockClosureTableHierarchy<MockTreeID>(new MockTreeID('D'), new MockTreeID('D')),
        new MockClosureTableHierarchy<MockTreeID>(new MockTreeID('E'), new MockTreeID('E'))
      );

      const factory: ClosureTableTreeFactory<MockTreeID, MockTreeObject<MockTreeID>> = ClosureTableTreeFactory.of<MockTreeID, MockTreeObject<MockTreeID>>(table);
      const project: Project<MockTreeID, MockTreeObject<MockTreeID>> = ImmutableProject.ofMap<MockTreeID, MockTreeObject<MockTreeID>>(new Map<MockTreeID, MockTreeObject<MockTreeID>>([
        [new MockTreeID('A'), new MockTreeObject(new MockTreeID('mock 1'))],
        [new MockTreeID('B'), new MockTreeObject(new MockTreeID('mock 2'))],
        [new MockTreeID('C'), new MockTreeObject(new MockTreeID('mock 3'))],
        [new MockTreeID('D'), new MockTreeObject(new MockTreeID('mock 4'))],
        [new MockTreeID('E'), new MockTreeObject(new MockTreeID('mock 5'))],
        [new MockTreeID('F'), new MockTreeObject(new MockTreeID('mock 6'))]
      ]));

      const trees: MutableProject<MockTreeID, StructurableTree<MockTreeID, MockTreeObject<MockTreeID>>> = factory.forge(project);
      const tree: Nullable<StructurableTree<MockTreeID, MockTreeObject<MockTreeID>>> = trees.get(new MockTreeID('mock 1'));

      if (tree === null) {
        fail();
        return;
      }

      expect(tree.getRoot().isLeaf()).toBe(false);
      expect(tree.getRoot().getValue().toString()).toBe('mock 1');

      const ch1: ReadonlyAddress<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>> = tree.getRoot().getChildren();
      const pairs1: Array<Pair<void, StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>> = [...ch1];

      expect(pairs1).toHaveLength(2);
      expect(pairs1[0].getValue().isLeaf()).toBe(true);
      expect(pairs1[0].getValue().getValue().toString()).toBe('mock 2');
      expect(pairs1[1].getValue().isLeaf()).toBe(false);
      expect(pairs1[1].getValue().getValue().toString()).toBe('mock 3');

      const ch2: ReadonlyAddress<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>> = pairs1[1].getValue().getChildren();
      const pairs2: Array<Pair<void, StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>> = [...ch2];

      expect(pairs2).toHaveLength(2);
      expect(pairs2[0].getValue().isLeaf()).toBe(true);
      expect(pairs2[0].getValue().getValue().toString()).toBe('mock 4');
      expect(pairs2[1].getValue().isLeaf()).toBe(true);
      expect(pairs2[1].getValue().getValue().toString()).toBe('mock 5');
    });

    it('throws TreeError when values have no such key-value pairs', () => {
      expect.assertions(1);

      const factory: ClosureTableTreeFactory<MockTreeID, MockTreeObject<MockTreeID>> = ClosureTableTreeFactory.of<MockTreeID, MockTreeObject<MockTreeID>>(ClosureTable.of<MockTreeID>([
        new MockClosureTableHierarchy(new MockTreeID('G'), new MockTreeID('G'))
      ]));
      const project: Project<MockTreeID, MockTreeObject<MockTreeID>> = ImmutableProject.ofMap<MockTreeID, MockTreeObject<MockTreeID>>(new Map<MockTreeID, MockTreeObject<MockTreeID>>([
        [new MockTreeID('A'), new MockTreeObject(new MockTreeID('mock 1'))],
        [new MockTreeID('B'), new MockTreeObject(new MockTreeID('mock 2'))],
        [new MockTreeID('C'), new MockTreeObject(new MockTreeID('mock 3'))],
        [new MockTreeID('D'), new MockTreeObject(new MockTreeID('mock 4'))],
        [new MockTreeID('E'), new MockTreeObject(new MockTreeID('mock 5'))],
        [new MockTreeID('F'), new MockTreeObject(new MockTreeID('mock 6'))]
      ]));

      expect(() => {
        factory.forge(project);
      }).toThrow(TreeError);
    });
  });
});
