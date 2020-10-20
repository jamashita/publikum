import { MockNominative } from '@jamashita/publikum-object';
import { ImmutableProject } from '../ImmutableProject';

describe('ImmutableProject', () => {
  describe('of', () => {
    it('returns copied collection, does not use the same one', () => {
      expect.assertions(6);

      const project: ImmutableProject<MockNominative<number>, MockNominative<number>> = ImmutableProject.ofMap<MockNominative<number>,
        MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([
          [new MockNominative<number>(1), new MockNominative<number>(2)],
          [new MockNominative<number>(3), new MockNominative<number>(4)]
        ])
      );
      const copied: ImmutableProject<MockNominative<number>, MockNominative<number>> = ImmutableProject.of<MockNominative<number>, MockNominative<number>>(project);

      expect(project.size()).toBe(copied.size());
      expect(project.get(new MockNominative<number>(1))).not.toBeNull();
      expect(project.get(new MockNominative<number>(1))).toBe(copied.get(new MockNominative<number>(1)));
      expect(project.get(new MockNominative<number>(3))).not.toBeNull();
      expect(project.get(new MockNominative<number>(3))).toBe(copied.get(new MockNominative<number>(3)));

      project.set(new MockNominative<number>(5), new MockNominative<number>(6));

      expect(project.size()).toBe(copied.size());
    });
  });

  describe('ofMap', () => {
    it('when the arguments specified with 0 length set, returns ImmutableAddress.empty()', () => {
      expect.assertions(2);

      const project: ImmutableProject<MockNominative<number>, MockNominative<number>> =
        ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(new Map<MockNominative<number>, MockNominative<number>>());

      expect(project.isEmpty()).toBe(true);
      expect(project).toBe(ImmutableProject.empty<MockNominative<number>, MockNominative<number>>());
    });

    it('normal case', () => {
      expect.assertions(2);

      const project1: ImmutableProject<MockNominative<number>, MockNominative<number>> =
        ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(
          new Map<MockNominative<number>, MockNominative<number>>([
            [new MockNominative<number>(1), new MockNominative<number>(2)],
            [new MockNominative<number>(5), new MockNominative<number>(6)]
          ])
        );
      const project2: ImmutableProject<MockNominative<number>, MockNominative<number>> =
        ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(
          new Map<MockNominative<number>, MockNominative<number>>([
            [new MockNominative<number>(3), new MockNominative<number>(4)],
            [new MockNominative<number>(7), new MockNominative<number>(8)],
            [new MockNominative<number>(9), new MockNominative<number>(10)]
          ])
        );

      expect(project1.size()).toBe(2);
      expect(project2.size()).toBe(3);
    });
  });

  describe('empty', () => {
    it('always empty, the size is 0', () => {
      expect.assertions(1);

      const project: ImmutableProject<MockNominative<number>, MockNominative<number>> =
        ImmutableProject.empty<MockNominative<number>, MockNominative<number>>();

      expect(project.size()).toBe(0);
    });

    it('returns singleton empty Address', () => {
      expect.assertions(1);

      expect(ImmutableProject.empty<MockNominative<number>, MockNominative<number>>()).toBe(ImmutableProject.empty<MockNominative<number>, MockNominative<number>>());
    });
  });

  describe('set', () => {
    it('can extend immutably', () => {
      expect.assertions(10);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(4);

      const nouns1: ImmutableProject<MockNominative<number>, MockNominative<number>> =
        ImmutableProject.empty<MockNominative<number>, MockNominative<number>>();

      expect(nouns1.size()).toBe(0);

      const nouns2: ImmutableProject<MockNominative<number>, MockNominative<number>> = nouns1.set(noun1, noun2);

      expect(nouns1).not.toBe(nouns2);
      expect(nouns1.size()).toBe(0);
      expect(nouns2.size()).toBe(1);

      const nouns3: ImmutableProject<MockNominative<number>, MockNominative<number>> = nouns2.set(noun3, noun4);

      expect(nouns1).not.toBe(nouns2);
      expect(nouns2).not.toBe(nouns3);
      expect(nouns3).not.toBe(nouns1);
      expect(nouns1.size()).toBe(0);
      expect(nouns2.size()).toBe(1);
      expect(nouns3.size()).toBe(2);
    });

    it('overwrites when the keys are already contained', () => {
      expect.assertions(4);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);

      const nouns1: ImmutableProject<MockNominative<number>, MockNominative<number>> =
        ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(new Map<MockNominative<number>, MockNominative<number>>([[noun1, noun2]]));
      const nouns2: ImmutableProject<MockNominative<number>, MockNominative<number>> = nouns1.set(noun1, noun3);

      expect(nouns1).not.toBe(nouns2);
      expect(nouns1.size()).toBe(1);
      expect(nouns2.size()).toBe(1);
      expect(nouns2.get(noun1)).toBe(noun3);
    });
  });

  describe('remove', () => {
    it('normal case', () => {
      expect.assertions(1);

      const noun: MockNominative<number> = new MockNominative<number>(1);

      const nouns1: ImmutableProject<MockNominative<number>, MockNominative<number>> =
        ImmutableProject.empty<MockNominative<number>, MockNominative<number>>();

      expect(nouns1.remove(noun)).toBe(nouns1);
    });

    it('does nothing because the key is already nothing', () => {
      expect.assertions(1);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);

      const nouns1: ImmutableProject<MockNominative<number>, MockNominative<number>> =
        ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(new Map<MockNominative<number>, MockNominative<number>>([[noun1, noun2]]));

      expect(nouns1.remove(noun3)).toBe(nouns1);
    });

    it('returns the value even if the other', () => {
      expect.assertions(3);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(1);

      const nouns1: ImmutableProject<MockNominative<number>, MockNominative<number>> =
        ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(new Map<MockNominative<number>, MockNominative<number>>([[noun1, noun2]]));
      const nouns2: ImmutableProject<MockNominative<number>, MockNominative<number>> = nouns1.remove(noun3);

      expect(nouns1).not.toBe(nouns2);
      expect(nouns1.size()).toBe(1);
      expect(nouns2.size()).toBe(0);
    });

    it('does not contains the value, returns itself', () => {
      expect.assertions(1);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);

      const nouns1: ImmutableProject<MockNominative<number>, MockNominative<number>> =
        ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(new Map<MockNominative<number>, MockNominative<number>>([[noun1, noun2]]));

      expect(nouns1.remove(noun3)).toBe(nouns1);
    });

    it('returns ImmutableProject.empty() when the size will be 0', () => {
      expect.assertions(1);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: ImmutableProject<MockNominative<number>, MockNominative<number>> =
        ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(new Map<MockNominative<number>, MockNominative<number>>([[noun1, noun2]]));

      expect(nouns1.remove(noun1)).toBe(ImmutableProject.empty<MockNominative<number>, MockNominative<number>>());
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      expect.assertions(2);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: ImmutableProject<MockNominative<number>, MockNominative<number>> =
        ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(new Map<MockNominative<number>, MockNominative<number>>([[noun1, noun2]]));
      const nouns2: ImmutableProject<MockNominative<number>, MockNominative<number>> =
        ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(new Map<MockNominative<number>, MockNominative<number>>([]));

      expect(nouns1.isEmpty()).toBe(false);
      expect(nouns2.isEmpty()).toBe(true);
    });
  });

  describe('map', () => {
    it('normal case', () => {
      expect.assertions(4);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(4);

      const nouns1: ImmutableProject<MockNominative<number>, MockNominative<number>> =
        ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(new Map<MockNominative<number>, MockNominative<number>>([
          [noun1, noun2],
          [noun3, noun4]
        ]));
      const nouns2: ImmutableProject<MockNominative<number>, MockNominative<number>> = nouns1.map<MockNominative<number>>((v: MockNominative<number>) => {
        return new MockNominative(v.get() + 10);
      });

      expect(nouns1.size()).toBe(nouns2.size());
      expect(nouns1).not.toBe(nouns2);
      nouns1.forEach((v: MockNominative<number>, k: MockNominative<number>) => {
        expect(nouns2.get(k)?.get()).toBe(v.get() + 10);
      });
    });
  });

  describe('duplicate', () => {
    it('normal case', () => {
      expect.assertions(2);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(4);

      const nouns1: ImmutableProject<MockNominative<number>, MockNominative<number>> =
        ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(new Map<MockNominative<number>, MockNominative<number>>([
          [noun1, noun2],
          [noun3, noun4]
        ]));
      const nouns2: ImmutableProject<MockNominative<number>, MockNominative<number>> = nouns1.duplicate();

      expect(nouns1.size()).toBe(nouns2.size());
      expect(nouns1).not.toBe(nouns2);
    });

    it('does not affect original one', () => {
      expect.assertions(4);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(4);

      const nouns1: ImmutableProject<MockNominative<number>, MockNominative<number>> =
        ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(new Map<MockNominative<number>, MockNominative<number>>([[noun1, noun2]]));
      const nouns2: ImmutableProject<MockNominative<number>, MockNominative<number>> = nouns1.duplicate();
      const nouns3: ImmutableProject<MockNominative<number>, MockNominative<number>> = nouns2.set(noun3, noun4);

      expect(nouns1.size()).toBe(nouns2.size());
      expect(nouns2.size()).not.toBe(nouns3.size());
      expect(nouns1).not.toBe(nouns2);
      expect(nouns2).not.toBe(nouns3);
    });

    it('returns ImmutableProject.empty() when there are no items', () => {
      expect.assertions(1);

      const nouns1: ImmutableProject<MockNominative<number>, MockNominative<number>> =
        ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(new Map<MockNominative<number>, MockNominative<number>>([]));

      expect(nouns1.duplicate()).toBe(nouns1);
    });
  });
});
