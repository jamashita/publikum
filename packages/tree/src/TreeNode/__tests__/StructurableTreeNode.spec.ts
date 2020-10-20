import { ImmutableAddress, MockAddress, MutableAddress } from '@jamashita/publikum-collection';
import { MockTreeID } from '@jamashita/publikum-tree';
import { MockTreeObject } from '../../Mock/MockTreeObject';
import { StructurableTreeNode } from '../StructurableTreeNode';

describe('StructurableTreeNode', () => {
  describe('of', () => {
    it('returns ImmutableAddress.empty() when empty children given', () => {
      expect.assertions(2);

      const node01: StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>> = StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 1')), MutableAddress.empty<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>());
      const node02: StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>> = StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 1')), new MockAddress<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(new Set<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>()));

      expect(node01.getChildren()).toBe(ImmutableAddress.empty<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>());
      expect(node02.getChildren()).toBe(ImmutableAddress.empty<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>());
    });
  });

  describe('getTreeID', () => {
    it('returns value\'s TreeID', () => {
      expect.assertions(1);

      const node: StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>> = StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeObject(new MockTreeID('mock 1')),
        ImmutableAddress.ofSet<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(new Set<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([
          StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 2')),
            ImmutableAddress.ofSet<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(new Set<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([
              StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 3')))
            ]))),
          StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 4')))
        ]))
      );

      expect(node.getTreeID().get()).toBe('mock 1');
    });
  });
});
