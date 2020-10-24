import { ImmutableAddress, MockAddress, MutableAddress } from '@jamashita/publikum-collection';
import { MockTreeID } from '../../Mock/MockTreeID';
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

  describe('find', () => {
    it('returns the value itself when the TreeNode value matches', () => {
      expect.assertions(1);

      const node: SerializableTreeNode<MockTreeObject<MockTreeID>> = SerializableTreeNode.of<MockTreeObject<MockTreeID>>(
        new MockTreeObject(new MockTreeID('mock 1')),
        ImmutableAddress.ofSet<SerializableTreeNode<MockTreeObject<MockTreeID>>>(
          new Set<SerializableTreeNode<MockTreeObject<MockTreeID>>>([
            SerializableTreeNode.of<MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 2')),
              ImmutableAddress.ofSet<SerializableTreeNode<MockTreeObject<MockTreeID>>>(
                new Set<SerializableTreeNode<MockTreeObject<MockTreeID>>>([
                  SerializableTreeNode.of<MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 3')))
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

      const node: SerializableTreeNode<MockTreeObject<MockTreeID>> = SerializableTreeNode.of<MockTreeObject<MockTreeID>>(
        new MockTreeObject(new MockTreeID('mock 1')),
        ImmutableAddress.ofSet<SerializableTreeNode<MockTreeObject<MockTreeID>>>(
          new Set<SerializableTreeNode<MockTreeObject<MockTreeID>>>([
            SerializableTreeNode.of<MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 2')),
              ImmutableAddress.ofSet<SerializableTreeNode<MockTreeObject<MockTreeID>>>(
                new Set<SerializableTreeNode<MockTreeObject<MockTreeID>>>([
                  SerializableTreeNode.of<MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 3')))
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

      const node: SerializableTreeNode<MockTreeObject<MockTreeID>> = SerializableTreeNode.of<MockTreeObject<MockTreeID>>(
        new MockTreeObject(new MockTreeID('mock 1')),
        ImmutableAddress.ofSet<SerializableTreeNode<MockTreeObject<MockTreeID>>>(
          new Set<SerializableTreeNode<MockTreeObject<MockTreeID>>>([
            SerializableTreeNode.of<MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 2')),
              ImmutableAddress.ofSet<SerializableTreeNode<MockTreeObject<MockTreeID>>>(
                new Set<SerializableTreeNode<MockTreeObject<MockTreeID>>>([
                  SerializableTreeNode.of<MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 3')))
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
