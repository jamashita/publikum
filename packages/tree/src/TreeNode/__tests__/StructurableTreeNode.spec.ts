import { ImmutableAddress, MockAddress, MutableAddress } from '@jamashita/publikum-collection';
import { MockTreeID } from '../../Mock/MockTreeID';
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

  describe('find', () => {
    it('returns the value itself when the TreeNode value matches', () => {
      expect.assertions(1);

      const node: StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>> = StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeObject(new MockTreeID('mock 1')),
        ImmutableAddress.ofSet<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(
          new Set<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([
            StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 2')),
              ImmutableAddress.ofSet<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(
                new Set<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([
                  StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 3')))
                ])
              ))
          ])
        )
      );

      expect(node.find((v: MockTreeObject<MockTreeID>) => {
        return v.getTreeID().equals(new MockTreeID('mock 1'));
      })?.getValue().getTreeID().equals(new MockTreeID('mock 1'))).toBe(true);
    });

    it('returns children\'s value when the TreeNode\'s children value matches', () => {
      expect.assertions(2);

      const node: StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>> = StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeObject(new MockTreeID('mock 1')),
        ImmutableAddress.ofSet<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(
          new Set<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([
            StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 2')),
              ImmutableAddress.ofSet<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(
                new Set<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([
                  StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 3')))
                ])
              ))
          ])
        )
      );

      expect(node.find((v: MockTreeObject<MockTreeID>) => {
        return v.getTreeID().equals(new MockTreeID('mock 2'));
      })?.getValue().getTreeID().equals(new MockTreeID('mock 2'))).toBe(true);
      expect(node.find((v: MockTreeObject<MockTreeID>) => {
        return v.getTreeID().equals(new MockTreeID('mock 3'));
      })?.getValue().getTreeID().equals(new MockTreeID('mock 3'))).toBe(true);
    });

    it('returns null when the TreeNode does not have such value', () => {
      expect.assertions(1);

      const node: StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>> = StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeObject(new MockTreeID('mock 1')),
        ImmutableAddress.ofSet<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(
          new Set<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([
            StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 2')),
              ImmutableAddress.ofSet<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(
                new Set<StructurableTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([
                  StructurableTreeNode.of<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 3')))
                ])
              ))
          ])
        )
      );

      expect(node.find((v: MockTreeObject<MockTreeID>) => {
        return v.getTreeID().equals(new MockTreeID('mock 4'));
      })).toBeNull();
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
