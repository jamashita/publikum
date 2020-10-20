import { ImmutableAddress } from '@jamashita/publikum-collection';
import { MockTreeID } from '@jamashita/publikum-tree';
import sinon, { SinonSpy } from 'sinon';
import { MockTree } from '../Mock/MockTree';
import { MockTreeObject } from '../Mock/MockTreeObject';
import { MockTreeNode } from '../TreeNode/Mock/MockTreeNode';

describe('ATree', () => {
  describe('equals', () => {
    it('returns true when the same instance given', () => {
      expect.assertions(1);

      const tree: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock'))));

      expect(tree.equals(tree)).toBe(true);
    });

    it('returns false when the different class instance given', () => {
      expect.assertions(1);

      const tree: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock'))));

      expect(tree.equals(new MockTreeObject(new MockTreeID('mock')))).toBe(false);
    });

    it('returns true when all the properties are the same', () => {
      expect.assertions(11);

      const tree01: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 1'))));
      const tree02: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 2'))));
      const tree03: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 1'))));
      const tree04: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
          new MockTreeObject(new MockTreeID('mock 1')),
          ImmutableAddress.ofSet<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(
            new Set<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 1')))])
          )
        )
      );
      const tree05: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
          new MockTreeObject(new MockTreeID('mock 1')),
          ImmutableAddress.ofSet<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(
            new Set<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 2')))])
          )
        )
      );
      const tree06: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
          new MockTreeObject(new MockTreeID('mock 2')),
          ImmutableAddress.ofSet<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(
            new Set<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 1')))])
          )
        )
      );
      const tree07: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
          new MockTreeObject(new MockTreeID('mock 2')),
          ImmutableAddress.ofSet<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(
            new Set<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 2')))])
          )
        )
      );
      const tree08: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
          new MockTreeObject(new MockTreeID('mock 1')),
          ImmutableAddress.ofSet<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(
            new Set<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 1')))])
          )
        )
      );

      expect(tree01.equals(tree02)).toBe(false);
      expect(tree01.equals(tree03)).toBe(true);
      expect(tree01.equals(tree04)).toBe(false);
      expect(tree01.equals(tree05)).toBe(false);
      expect(tree01.equals(tree06)).toBe(false);
      expect(tree01.equals(tree07)).toBe(false);
      expect(tree01.equals(tree08)).toBe(false);
      expect(tree04.equals(tree05)).toBe(false);
      expect(tree04.equals(tree06)).toBe(false);
      expect(tree04.equals(tree07)).toBe(false);
      expect(tree04.equals(tree08)).toBe(true);
    });
  });

  describe('toString', () => {
    it('delegates its node instance', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();
      const root: MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>> = new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject<MockTreeID>(new MockTreeID('mock')));

      root.toString = spy;

      const tree: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(root);

      tree.toString();

      expect(spy.called).toBe(true);
    });
  });

  describe('getRoot', () => {
    it('returns root', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();
      const root: MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>> = new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock')));

      root.getValue = spy;

      const tree: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(root);

      expect(tree.getRoot()).toBe(root);
    });
  });
});
