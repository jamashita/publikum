import sinon, { SinonSpy } from 'sinon';
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
});
