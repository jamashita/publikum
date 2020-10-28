import { ImmutableAddress } from '@jamashita/publikum-collection';
import { MockTreeID } from '../Mock/MockTreeID';
import { MockTreeObject } from '../Mock/MockTreeObject';
import { SerializableTree } from '../SerializableTree';
import { SerializableTrees } from '../SerializableTrees';
import { SerializableTreeNode } from '../TreeNode/SerializableTreeNode';

describe('SerializableTrees', () => {
  describe('toJSON', () => {
    it('returns ReadonlyArray<TreeNodeJSON>', () => {
      expect.assertions(1);

      const id1: MockTreeID = new MockTreeID('tree id 1');
      const id2: MockTreeID = new MockTreeID('tree id 2');
      const id3: MockTreeID = new MockTreeID('tree id 3');
      const id4: MockTreeID = new MockTreeID('tree id 4');
      const id5: MockTreeID = new MockTreeID('tree id 5');
      const id6: MockTreeID = new MockTreeID('tree id 6');
      const id7: MockTreeID = new MockTreeID('tree id 7');

      const tree1: SerializableTree<MockTreeObject<MockTreeID>> = SerializableTree.of<MockTreeObject<MockTreeID>>(
        SerializableTreeNode.ofValue<MockTreeObject<MockTreeID>>(
          new MockTreeObject<MockTreeID>(id1),
          ImmutableAddress.ofSet<SerializableTreeNode<MockTreeObject<MockTreeID>>>(
            new Set<SerializableTreeNode<MockTreeObject<MockTreeID>>>([
              SerializableTreeNode.ofValue<MockTreeObject<MockTreeID>>(
                new MockTreeObject<MockTreeID>(id2)
              ),
              SerializableTreeNode.ofValue<MockTreeObject<MockTreeID>>(
                new MockTreeObject<MockTreeID>(id3),
                ImmutableAddress.ofSet<SerializableTreeNode<MockTreeObject<MockTreeID>>>(
                  new Set<SerializableTreeNode<MockTreeObject<MockTreeID>>>([
                    SerializableTreeNode.ofValue<MockTreeObject<MockTreeID>>(
                      new MockTreeObject<MockTreeID>(id4)
                    )
                  ])
                )
              )
            ])
          )
        )
      );
      const tree2: SerializableTree<MockTreeObject<MockTreeID>> = SerializableTree.of<MockTreeObject<MockTreeID>>(
        SerializableTreeNode.ofValue<MockTreeObject<MockTreeID>>(
          new MockTreeObject<MockTreeID>(id5),
          ImmutableAddress.ofSet<SerializableTreeNode<MockTreeObject<MockTreeID>>>(
            new Set<SerializableTreeNode<MockTreeObject<MockTreeID>>>([
              SerializableTreeNode.ofValue<MockTreeObject<MockTreeID>>(
                new MockTreeObject<MockTreeID>(id6)
              )
            ])
          )
        )
      );
      const tree3: SerializableTree<MockTreeObject<MockTreeID>> = SerializableTree.of<MockTreeObject<MockTreeID>>(
        SerializableTreeNode.ofValue<MockTreeObject<MockTreeID>>(
          new MockTreeObject<MockTreeID>(id7)
        )
      );

      const trees: SerializableTrees<MockTreeObject<MockTreeID>> = SerializableTrees.ofAddress<MockTreeObject<MockTreeID>>(
        ImmutableAddress.ofSet<SerializableTree<MockTreeObject<MockTreeID>>>(
          new Set<SerializableTree<MockTreeObject<MockTreeID>>>([
            tree1,
            tree2,
            tree3
          ])
        )
      );

      expect(trees.toJSON()).toStrictEqual([
        {
          value: {
            id: 'tree id 1'
          },
          children: [
            {
              value: {
                id: 'tree id 2'
              },
              children: []
            },
            {
              value: {
                id: 'tree id 3'
              },
              children: [
                {
                  value: {
                    id: 'tree id 4'
                  },
                  children: []
                }
              ]
            }
          ]
        },
        {
          value: {
            id: 'tree id 5'
          },
          children: [
            {
              value: {
                id: 'tree id 6'
              },
              children: []
            }
          ]
        },
        {
          value: {
            id: 'tree id 7'
          },
          children: []
        }
      ]);
    });
  });
});
