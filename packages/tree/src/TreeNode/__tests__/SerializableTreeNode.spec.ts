import { ImmutableAddress, MockAddress, MutableAddress } from '@jamashita/publikum-collection';
import { MockTreeID } from '@jamashita/publikum-tree';
import { MockTreeObject } from '../../Mock/MockTreeObject';
import { SerializableTreeNode } from '../SerializableTreeNode';

describe('SerializableTreeNode', () => {
  describe('of', () => {
    it('returns ImmutableAddress.empty() when empty children given', () => {
      expect.assertions(2);

      const node01: SerializableTreeNode<MockTreeObject<MockTreeID>> = SerializableTreeNode.of<MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 1')), MutableAddress.empty<SerializableTreeNode<MockTreeObject<MockTreeID>>>());
      const node02: SerializableTreeNode<MockTreeObject<MockTreeID>> = SerializableTreeNode.of<MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 1')), new MockAddress<SerializableTreeNode<MockTreeObject<MockTreeID>>>(new Set<SerializableTreeNode<MockTreeObject<MockTreeID>>>()));

      expect(node01.getChildren()).toBe(ImmutableAddress.empty<SerializableTreeNode<MockTreeObject<MockTreeID>>>());
      expect(node02.getChildren()).toBe(ImmutableAddress.empty<SerializableTreeNode<MockTreeObject<MockTreeID>>>());
    });
  });

  describe('toJSON', () => {
    it('returns SerializableTreeNodeJSON', () => {
      expect.assertions(1);

      const node: SerializableTreeNode<MockTreeObject<MockTreeID>> = SerializableTreeNode.of<MockTreeObject<MockTreeID>>(
        new MockTreeObject(new MockTreeID('mock 1')),
        ImmutableAddress.ofSet<SerializableTreeNode<MockTreeObject<MockTreeID>>>(new Set<SerializableTreeNode<MockTreeObject<MockTreeID>>>([
          SerializableTreeNode.of<MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 2')),
            ImmutableAddress.ofSet<SerializableTreeNode<MockTreeObject<MockTreeID>>>(new Set<SerializableTreeNode<MockTreeObject<MockTreeID>>>([
              SerializableTreeNode.of<MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 3')))
            ]))),
          SerializableTreeNode.of<MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 4')))
        ]))
      );

      expect(node.toJSON()).toStrictEqual({
        value: {
          id: 'mock 1'
        },
        children: [
          {
            value: {
              id: 'mock 2'
            },
            children: [
              {
                value: {
                  id: 'mock 3'
                },
                children: []
              }
            ]
          },
          {
            value: {
              id: 'mock 4'
            },
            children: []
          }
        ]
      });
    });
  });
});
