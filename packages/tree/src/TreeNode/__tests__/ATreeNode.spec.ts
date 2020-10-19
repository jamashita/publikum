import { ImmutableAddress } from '@jamashita/publikum-collection';
import { MockTreeID } from '@jamashita/publikum-tree';
import { MockTreeObject } from '../../Mock/MockTreeObject';
import { MockTreeNode } from '../Mock/MockTreeNode';

describe('ATreeNode', () => {
  describe('equals', () => {
    it('returns true when the same instance given', () => {
      expect.assertions(2);

      const node01: MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>> = new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 1')), ImmutableAddress.empty<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>());
      const node02: MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>> = new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeObject(new MockTreeID('mock 1')),
        ImmutableAddress.ofSet<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(
          new Set<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([
            new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 2')), ImmutableAddress.empty<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>())
          ])
        )
      );

      expect(node01.equals(node01)).toBe(true);
      expect(node02.equals(node02)).toBe(true);
    });

    it('returns false when the different class instance given', () => {
      expect.assertions(1);

      const node: MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>> = new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 1')), ImmutableAddress.empty<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>());

      expect(node.equals(new MockTreeObject(new MockTreeID('mock')))).toBe(false);
    });

    it('returns true when all the properties are the same', () => {
      expect.assertions(11);

      const node01: MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>> = new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 1')), ImmutableAddress.empty<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>());
      const node02: MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>> = new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 2')), ImmutableAddress.empty<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>());
      const node03: MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>> = new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 1')), ImmutableAddress.empty<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>());
      const node04: MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>> = new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeObject(new MockTreeID('mock 1')),
        ImmutableAddress.ofSet<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(
          new Set<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([
            new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 2')), ImmutableAddress.empty<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>())
          ])
        )
      );
      const node05: MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>> = new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeObject(new MockTreeID('mock 3')),
        ImmutableAddress.ofSet<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(
          new Set<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([
            new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 2')), ImmutableAddress.empty<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>())
          ])
        )
      );
      const node06: MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>> = new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeObject(new MockTreeID('mock 1')),
        ImmutableAddress.ofSet<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(
          new Set<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([
            new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 4')), ImmutableAddress.empty<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>())
          ])
        )
      );
      const node07: MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>> = new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeObject(new MockTreeID('mock 1')),
        ImmutableAddress.ofSet<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(
          new Set<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([
            new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 2')), ImmutableAddress.empty<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>()),
            new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 3')), ImmutableAddress.empty<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>())
          ])
        )
      );
      const node08: MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>> = new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeObject(new MockTreeID('mock 1')),
        ImmutableAddress.ofSet<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(
          new Set<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([
            new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 2')), ImmutableAddress.empty<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>())
          ])
        )
      );

      expect(node01.equals(node02)).toBe(false);
      expect(node01.equals(node03)).toBe(true);
      expect(node01.equals(node04)).toBe(false);
      expect(node01.equals(node05)).toBe(false);
      expect(node01.equals(node06)).toBe(false);
      expect(node01.equals(node07)).toBe(false);
      expect(node01.equals(node08)).toBe(false);
      expect(node04.equals(node05)).toBe(false);
      expect(node04.equals(node06)).toBe(false);
      expect(node04.equals(node07)).toBe(false);
      expect(node04.equals(node08)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns JSON-like string', () => {
      expect.assertions(3);

      const node01: MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>> = new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 1')), ImmutableAddress.empty<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>());
      const node02: MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>> = new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeObject(new MockTreeID('mock 1')),
        ImmutableAddress.ofSet<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(
          new Set<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([
            new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 2')), ImmutableAddress.empty<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>())
          ])
        )
      );
      const node03: MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>> = new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeObject(new MockTreeID('mock 1')),
        ImmutableAddress.ofSet<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(new Set<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([
          new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 2')),
            ImmutableAddress.ofSet<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(new Set<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([
              new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 3')), ImmutableAddress.empty<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>())
            ])))
        ]))
      );

      expect(node01.toString()).toBe('{VALUE: mock 1}');
      expect(node02.toString()).toBe('{VALUE: mock 1, CHILDREN: [{VALUE: mock 2}]}');
      expect(node03.toString()).toBe('{VALUE: mock 1, CHILDREN: [{VALUE: mock 2, CHILDREN: [{VALUE: mock 3}]}]}');
    });
  });
  describe('isLeaf', () => {
    it('returns false if it owns children', () => {
      expect.assertions(1);

      const node: MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>> = new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeObject(new MockTreeID('mock 1')),
        ImmutableAddress.ofSet<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(
          new Set<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([
            new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 2')), ImmutableAddress.empty<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>())
          ])
        )
      );

      expect(node.isLeaf()).toBe(false);
    });

    it('returns true if it does not own children', () => {
      expect.assertions(1);

      const node: MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>> = new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject(new MockTreeID('mock 1')), ImmutableAddress.empty<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>());

      expect(node.isLeaf()).toBe(true);
    });
  });
});
