import { ImmutableAddress } from '@jamashita/publikum-collection';
import sinon, { SinonSpy } from 'sinon';
import { ClosureTableHierarchies } from '../ClosureTable/ClosureTableHierarchies';
import { MockTreeID } from '../Mock/MockTreeID';
import { MockTreeObject } from '../Mock/MockTreeObject';
import { StructurableTree } from '../StructurableTree';
import { StructurableTreeNode } from '../TreeNode/StructurableTreeNode';

describe('StructurableTree', () => {
  describe('getTreeID', () => {
    it('delegates its root instance', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();
      const root: StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>> = StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject<MockTreeID>(new MockTreeID('mock')));

      root.getTreeID = spy;

      const tree: StructurableTree<MockTreeID, MockTreeObject<MockTreeID>> = StructurableTree.of<MockTreeID, MockTreeObject<MockTreeID>>(root);

      tree.getTreeID();

      expect(spy.called).toBe(true);
    });
  });

  describe('toHierarchies', () => {
    it('returns one-length array when no no-children tree given', () => {
      expect.assertions(3);

      const tree: StructurableTree<MockTreeID, MockTreeObject<MockTreeID>> = StructurableTree.of<MockTreeID, MockTreeObject<MockTreeID>>(
        StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 1')), ImmutableAddress.empty<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>())
      );

      const hierarchies: ClosureTableHierarchies<MockTreeID> = tree.toHierarchies();

      expect(hierarchies.size()).toBe(1);
      expect(hierarchies.get(0)?.getAncestor().get()).toBe('mock 1');
      expect(hierarchies.get(0)?.getOffspring().get()).toBe('mock 1');
    });

    it('returns simpler array when simplest Tree given', () => {
      expect.assertions(11);

      const tree: StructurableTree<MockTreeID, MockTreeObject<MockTreeID>> = StructurableTree.of<MockTreeID, MockTreeObject<MockTreeID>>(
        StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(
          new MockTreeObject(new MockTreeID('mock 1')),
          ImmutableAddress.ofSet<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(
            new Set<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([
              StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 2')), ImmutableAddress.empty<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>()),
              StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 3')), ImmutableAddress.empty<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>())
            ])
          )
        )
      );

      const hierarchies: ClosureTableHierarchies<MockTreeID> = tree.toHierarchies();

      expect(hierarchies.size()).toBe(5);
      expect(hierarchies.get(0)?.getAncestor().get()).toBe('mock 1');
      expect(hierarchies.get(0)?.getOffspring().get()).toBe('mock 1');
      expect(hierarchies.get(1)?.getAncestor().get()).toBe('mock 1');
      expect(hierarchies.get(1)?.getOffspring().get()).toBe('mock 2');
      expect(hierarchies.get(2)?.getAncestor().get()).toBe('mock 1');
      expect(hierarchies.get(2)?.getOffspring().get()).toBe('mock 3');
      expect(hierarchies.get(3)?.getAncestor().get()).toBe('mock 2');
      expect(hierarchies.get(3)?.getOffspring().get()).toBe('mock 2');
      expect(hierarchies.get(4)?.getAncestor().get()).toBe('mock 3');
      expect(hierarchies.get(4)?.getOffspring().get()).toBe('mock 3');
    });

    it('returns closure table array when complex Tree given', () => {
      expect.assertions(49);

      const tree: StructurableTree<MockTreeID, MockTreeObject<MockTreeID>> = StructurableTree.of<MockTreeID, MockTreeObject<MockTreeID>>(
        StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(
          new MockTreeObject(new MockTreeID('mock 1')),
          ImmutableAddress.ofSet<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(
            new Set<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([
              StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(
                new MockTreeObject(new MockTreeID('mock 2')),
                ImmutableAddress.ofSet<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(
                  new Set<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([
                    StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(
                      new MockTreeObject(new MockTreeID('mock 3')),
                      ImmutableAddress.ofSet<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(
                        new Set<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([
                          StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 4')), ImmutableAddress.empty<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>()),
                          StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 5')), ImmutableAddress.empty<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>())
                        ])
                      )
                    ),
                    StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 6')), ImmutableAddress.empty<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>()),
                    StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 7')), ImmutableAddress.empty<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>())
                  ])
                )
              ),
              StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 8')), ImmutableAddress.empty<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>()),
              StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 9')), ImmutableAddress.empty<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>())
            ])
          )
        )
      );

      const hierarchies: ClosureTableHierarchies<MockTreeID> = tree.toHierarchies();

      expect(hierarchies.size()).toBe(24);
      expect(hierarchies.get(0)?.getAncestor().get()).toBe('mock 1');
      expect(hierarchies.get(0)?.getOffspring().get()).toBe('mock 1');
      expect(hierarchies.get(1)?.getAncestor().get()).toBe('mock 1');
      expect(hierarchies.get(1)?.getOffspring().get()).toBe('mock 2');
      expect(hierarchies.get(2)?.getAncestor().get()).toBe('mock 1');
      expect(hierarchies.get(2)?.getOffspring().get()).toBe('mock 3');
      expect(hierarchies.get(3)?.getAncestor().get()).toBe('mock 1');
      expect(hierarchies.get(3)?.getOffspring().get()).toBe('mock 4');
      expect(hierarchies.get(4)?.getAncestor().get()).toBe('mock 1');
      expect(hierarchies.get(4)?.getOffspring().get()).toBe('mock 5');
      expect(hierarchies.get(5)?.getAncestor().get()).toBe('mock 1');
      expect(hierarchies.get(5)?.getOffspring().get()).toBe('mock 6');
      expect(hierarchies.get(6)?.getAncestor().get()).toBe('mock 1');
      expect(hierarchies.get(6)?.getOffspring().get()).toBe('mock 7');
      expect(hierarchies.get(7)?.getAncestor().get()).toBe('mock 1');
      expect(hierarchies.get(7)?.getOffspring().get()).toBe('mock 8');
      expect(hierarchies.get(8)?.getAncestor().get()).toBe('mock 1');
      expect(hierarchies.get(8)?.getOffspring().get()).toBe('mock 9');
      expect(hierarchies.get(9)?.getAncestor().get()).toBe('mock 2');
      expect(hierarchies.get(9)?.getOffspring().get()).toBe('mock 2');
      expect(hierarchies.get(10)?.getAncestor().get()).toBe('mock 2');
      expect(hierarchies.get(10)?.getOffspring().get()).toBe('mock 3');
      expect(hierarchies.get(11)?.getAncestor().get()).toBe('mock 2');
      expect(hierarchies.get(11)?.getOffspring().get()).toBe('mock 4');
      expect(hierarchies.get(12)?.getAncestor().get()).toBe('mock 2');
      expect(hierarchies.get(12)?.getOffspring().get()).toBe('mock 5');
      expect(hierarchies.get(13)?.getAncestor().get()).toBe('mock 2');
      expect(hierarchies.get(13)?.getOffspring().get()).toBe('mock 6');
      expect(hierarchies.get(14)?.getAncestor().get()).toBe('mock 2');
      expect(hierarchies.get(14)?.getOffspring().get()).toBe('mock 7');
      expect(hierarchies.get(15)?.getAncestor().get()).toBe('mock 3');
      expect(hierarchies.get(15)?.getOffspring().get()).toBe('mock 3');
      expect(hierarchies.get(16)?.getAncestor().get()).toBe('mock 3');
      expect(hierarchies.get(16)?.getOffspring().get()).toBe('mock 4');
      expect(hierarchies.get(17)?.getAncestor().get()).toBe('mock 3');
      expect(hierarchies.get(17)?.getOffspring().get()).toBe('mock 5');
      expect(hierarchies.get(18)?.getAncestor().get()).toBe('mock 4');
      expect(hierarchies.get(18)?.getOffspring().get()).toBe('mock 4');
      expect(hierarchies.get(19)?.getAncestor().get()).toBe('mock 5');
      expect(hierarchies.get(19)?.getOffspring().get()).toBe('mock 5');
      expect(hierarchies.get(20)?.getAncestor().get()).toBe('mock 6');
      expect(hierarchies.get(20)?.getOffspring().get()).toBe('mock 6');
      expect(hierarchies.get(21)?.getAncestor().get()).toBe('mock 7');
      expect(hierarchies.get(21)?.getOffspring().get()).toBe('mock 7');
      expect(hierarchies.get(22)?.getAncestor().get()).toBe('mock 8');
      expect(hierarchies.get(22)?.getOffspring().get()).toBe('mock 8');
      expect(hierarchies.get(23)?.getAncestor().get()).toBe('mock 9');
      expect(hierarchies.get(23)?.getOffspring().get()).toBe('mock 9');
    });
  });
});
