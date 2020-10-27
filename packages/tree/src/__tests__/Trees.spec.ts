import { ImmutableAddress, ImmutableProject, MockProject } from '@jamashita/publikum-collection';
import { MockValueObject } from '@jamashita/publikum-object';
import { MockTree, MockTreeID, MockTreeNode, MockTreeObject } from '@jamashita/publikum-tree';
import sinon, { SinonSpy } from 'sinon';
import { MockTrees } from '../Mock/MockTrees';

describe('Trees', () => {
  describe('iterator', () => {
    it('returns Pair<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>', () => {
      expect.assertions(3);

      const id1: MockTreeID = new MockTreeID('tree id 1');
      const id2: MockTreeID = new MockTreeID('tree id 2');
      const id3: MockTreeID = new MockTreeID('tree id 3');
      const id4: MockTreeID = new MockTreeID('tree id 4');
      const id5: MockTreeID = new MockTreeID('tree id 5');
      const id6: MockTreeID = new MockTreeID('tree id 6');
      const id7: MockTreeID = new MockTreeID('tree id 7');

      const tree1: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
          new MockTreeObject<MockTreeID>(id1),
          ImmutableAddress.ofSet<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(
            new Set<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([
              new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
                new MockTreeObject<MockTreeID>(id2)
              ),
              new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
                new MockTreeObject<MockTreeID>(id3),
                ImmutableAddress.ofSet<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(
                  new Set<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([
                    new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
                      new MockTreeObject<MockTreeID>(id4)
                    )
                  ])
                )
              )
            ])
          )
        )
      );
      const tree2: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
          new MockTreeObject<MockTreeID>(id5),
          ImmutableAddress.ofSet<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>(
            new Set<MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>>([
              new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
                new MockTreeObject<MockTreeID>(id6)
              )
            ])
          )
        )
      );
      const tree3: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
          new MockTreeObject<MockTreeID>(id7)
        )
      );
      const array: Array<MockTree<MockTreeID, MockTreeObject<MockTreeID>>> = [
        tree1,
        tree2,
        tree3
      ];

      const trees: MockTrees<MockTreeID, MockTreeObject<MockTreeID>> = new MockTrees<MockTreeID, MockTreeObject<MockTreeID>>(
        ImmutableProject.ofMap<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>(
          new Map<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>([
            [id1, tree1],
            [id5, tree2],
            [id7, tree3]
          ])
        )
      );
      let i: number = 0;

      for (const pair of trees) {
        expect(pair.getValue()).toBe(array[i]);
        i++;
      }
    });
  });

  describe('contains', () => {
    it('delegates its retaining project', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();

      const id: MockTreeID = new MockTreeID('tree id');
      const tree: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
          new MockTreeObject<MockTreeID>(id)
        )
      );

      const project: MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>> = new MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>(
        new Map<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>([
          [id, tree]
        ])
      );

      project.contains = spy;

      const trees: MockTrees<MockTreeID, MockTreeObject<MockTreeID>> = new MockTrees<MockTreeID, MockTreeObject<MockTreeID>>(project);

      trees.contains(new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject<MockTreeID>(id))));

      expect(spy.called).toBe(true);
    });
  });

  describe('equals', () => {
    it('returns true when the same instance given', () => {
      expect.assertions(1);

      const id: MockTreeID = new MockTreeID('tree id');
      const tree: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
          new MockTreeObject<MockTreeID>(id)
        )
      );

      const project: MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>> = new MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>(
        new Map<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>([
          [id, tree]
        ])
      );

      const trees: MockTrees<MockTreeID, MockTreeObject<MockTreeID>> = new MockTrees<MockTreeID, MockTreeObject<MockTreeID>>(project);

      expect(trees.equals(trees)).toBe(true);
    });

    it('returns false when the different class instance given', () => {
      expect.assertions(1);

      const id: MockTreeID = new MockTreeID('tree id');
      const tree: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
          new MockTreeObject<MockTreeID>(id)
        )
      );

      const project: MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>> = new MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>(
        new Map<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>([
          [id, tree]
        ])
      );

      const trees: MockTrees<MockTreeID, MockTreeObject<MockTreeID>> = new MockTrees<MockTreeID, MockTreeObject<MockTreeID>>(project);

      expect(trees.equals(new MockValueObject('mock'))).toBe(false);
    });

    it('delegates its retaining project', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();

      const id: MockTreeID = new MockTreeID('tree id');
      const tree: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
          new MockTreeObject<MockTreeID>(id)
        )
      );

      const project: MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>> = new MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>(
        new Map<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>([
          [id, tree]
        ])
      );

      project.equals = spy;

      const trees: MockTrees<MockTreeID, MockTreeObject<MockTreeID>> = new MockTrees<MockTreeID, MockTreeObject<MockTreeID>>(project);

      trees.equals(new MockTrees<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>(
          new Map<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>([
            [id, new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(new MockTreeObject<MockTreeID>(id)))]
          ])
        )
      ));

      expect(spy.called).toBe(true);
    });
  });

  describe('every', () => {
    it('delegates its retaining project', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();

      const id: MockTreeID = new MockTreeID('tree id');
      const tree: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
          new MockTreeObject<MockTreeID>(id)
        )
      );

      const project: MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>> = new MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>(
        new Map<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>([
          [id, tree]
        ])
      );

      project.every = spy;

      const trees: MockTrees<MockTreeID, MockTreeObject<MockTreeID>> = new MockTrees<MockTreeID, MockTreeObject<MockTreeID>>(project);

      trees.every(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('forEach', () => {
    it('delegates its retaining project', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();

      const id: MockTreeID = new MockTreeID('tree id');
      const tree: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
          new MockTreeObject<MockTreeID>(id)
        )
      );

      const project: MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>> = new MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>(
        new Map<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>([
          [id, tree]
        ])
      );

      project.forEach = spy;

      const trees: MockTrees<MockTreeID, MockTreeObject<MockTreeID>> = new MockTrees<MockTreeID, MockTreeObject<MockTreeID>>(project);

      trees.forEach(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('get', () => {
    it('delegates its retaining project', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();

      const id: MockTreeID = new MockTreeID('tree id');
      const tree: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
          new MockTreeObject<MockTreeID>(id)
        )
      );

      const project: MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>> = new MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>(
        new Map<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>([
          [id, tree]
        ])
      );

      project.get = spy;

      const trees: MockTrees<MockTreeID, MockTreeObject<MockTreeID>> = new MockTrees<MockTreeID, MockTreeObject<MockTreeID>>(project);

      trees.get(new MockTreeID('tree id 1010'));

      expect(spy.called).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('delegates its retaining project', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();

      const id: MockTreeID = new MockTreeID('tree id');
      const tree: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
          new MockTreeObject<MockTreeID>(id)
        )
      );

      const project: MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>> = new MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>(
        new Map<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>([
          [id, tree]
        ])
      );

      project.isEmpty = spy;

      const trees: MockTrees<MockTreeID, MockTreeObject<MockTreeID>> = new MockTrees<MockTreeID, MockTreeObject<MockTreeID>>(project);

      trees.isEmpty();

      expect(spy.called).toBe(true);
    });
  });

  describe('toString', () => {
    it('delegates its retaining project', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();

      const id: MockTreeID = new MockTreeID('tree id');
      const tree: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
          new MockTreeObject<MockTreeID>(id)
        )
      );

      const project: MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>> = new MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>(
        new Map<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>([
          [id, tree]
        ])
      );

      project.toString = spy;

      const trees: MockTrees<MockTreeID, MockTreeObject<MockTreeID>> = new MockTrees<MockTreeID, MockTreeObject<MockTreeID>>(project);

      trees.toString();

      expect(spy.called).toBe(true);
    });
  });

  describe('size', () => {
    it('delegates its retaining project', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();

      const id: MockTreeID = new MockTreeID('tree id');
      const tree: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
          new MockTreeObject<MockTreeID>(id)
        )
      );

      const project: MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>> = new MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>(
        new Map<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>([
          [id, tree]
        ])
      );

      project.size = spy;

      const trees: MockTrees<MockTreeID, MockTreeObject<MockTreeID>> = new MockTrees<MockTreeID, MockTreeObject<MockTreeID>>(project);

      trees.size();

      expect(spy.called).toBe(true);
    });
  });

  describe('some', () => {
    it('delegates its retaining project', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();

      const id: MockTreeID = new MockTreeID('tree id');
      const tree: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
          new MockTreeObject<MockTreeID>(id)
        )
      );

      const project: MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>> = new MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>(
        new Map<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>([
          [id, tree]
        ])
      );

      project.some = spy;

      const trees: MockTrees<MockTreeID, MockTreeObject<MockTreeID>> = new MockTrees<MockTreeID, MockTreeObject<MockTreeID>>(project);

      trees.some(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('values', () => {
    it('delegates its retaining project', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();

      const id: MockTreeID = new MockTreeID('tree id');
      const tree: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
          new MockTreeObject<MockTreeID>(id)
        )
      );

      const project: MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>> = new MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>(
        new Map<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>([
          [id, tree]
        ])
      );

      project.values = spy;

      const trees: MockTrees<MockTreeID, MockTreeObject<MockTreeID>> = new MockTrees<MockTreeID, MockTreeObject<MockTreeID>>(project);

      trees.values();

      expect(spy.called).toBe(true);
    });
  });

  describe('filter', () => {
    it('delegates its retaining project', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();

      const id: MockTreeID = new MockTreeID('tree id');
      const tree: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
          new MockTreeObject<MockTreeID>(id)
        )
      );

      const project: MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>> = new MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>(
        new Map<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>([
          [id, tree]
        ])
      );

      project.filter = spy;

      const trees: MockTrees<MockTreeID, MockTreeObject<MockTreeID>> = new MockTrees<MockTreeID, MockTreeObject<MockTreeID>>(project);

      trees.filter(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('find', () => {
    it('delegates its retaining project', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();

      const id: MockTreeID = new MockTreeID('tree id');
      const tree: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
          new MockTreeObject<MockTreeID>(id)
        )
      );

      const project: MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>> = new MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>(
        new Map<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>([
          [id, tree]
        ])
      );

      project.find = spy;

      const trees: MockTrees<MockTreeID, MockTreeObject<MockTreeID>> = new MockTrees<MockTreeID, MockTreeObject<MockTreeID>>(project);

      trees.find(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('map', () => {
    it('delegates its retaining project', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();

      const id: MockTreeID = new MockTreeID('tree id');
      const tree: MockTree<MockTreeID, MockTreeObject<MockTreeID>> = new MockTree<MockTreeID, MockTreeObject<MockTreeID>>(
        new MockTreeNode<MockTreeID, MockTreeObject<MockTreeID>>(
          new MockTreeObject<MockTreeID>(id)
        )
      );

      const project: MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>> = new MockProject<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>(
        new Map<MockTreeID, MockTree<MockTreeID, MockTreeObject<MockTreeID>>>([
          [id, tree]
        ])
      );

      project.map = spy;

      const trees: MockTrees<MockTreeID, MockTreeObject<MockTreeID>> = new MockTrees<MockTreeID, MockTreeObject<MockTreeID>>(project);

      trees.map((t: MockTree<MockTreeID, MockTreeObject<MockTreeID>>) => {
        return t;
      });

      expect(spy.called).toBe(true);
    });
  });
});
