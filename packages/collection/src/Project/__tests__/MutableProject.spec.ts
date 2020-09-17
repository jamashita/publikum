import { MockNominative } from '@jamashita/publikum-object';
import { MutableProject } from '../MutableProject';

describe('MutableProject', () => {
  describe('of', () => {
    it('normal case', () => {
      expect.assertions(2);

      const project1: MutableProject<MockNominative<number>, MockNominative<number>> = MutableProject.of<MockNominative<number>,
        MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([
          [new MockNominative<number>(1), new MockNominative<number>(2)],
          [new MockNominative<number>(5), new MockNominative<number>(6)]
        ])
      );
      const project2: MutableProject<MockNominative<number>, MockNominative<number>> = MutableProject.of<MockNominative<number>,
        MockNominative<number>>(
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

      const project: MutableProject<MockNominative<number>, MockNominative<number>> = MutableProject.empty<MockNominative<number>,
        MockNominative<number>>();

      expect(project.size()).toBe(0);
    });

    it('returns different empty Project', () => {
      expect.assertions(1);

      expect(MutableProject.empty<MockNominative<number>, MockNominative<number>>()).not.toBe(
        MutableProject.empty<MockNominative<number>, MockNominative<number>>()
      );
    });
  });

  describe('set', () => {
    it('can extend mutably', () => {
      expect.assertions(7);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(4);

      const nouns1: MutableProject<MockNominative<number>, MockNominative<number>> = MutableProject.empty<MockNominative<number>,
        MockNominative<number>>();

      expect(nouns1.size()).toBe(0);

      const nouns2: MutableProject<MockNominative<number>, MockNominative<number>> = nouns1.set(noun1, noun2);

      expect(nouns1).toBe(nouns2);
      expect(nouns1.size()).toBe(1);

      const nouns3: MutableProject<MockNominative<number>, MockNominative<number>> = nouns2.set(noun3, noun4);

      expect(nouns1).toBe(nouns2);
      expect(nouns2).toBe(nouns3);
      expect(nouns3).toBe(nouns1);
      expect(nouns1.size()).toBe(2);
    });

    it('overwrites when the keys are already contained', () => {
      expect.assertions(3);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);

      const nouns1: MutableProject<MockNominative<number>, MockNominative<number>> = MutableProject.of<MockNominative<number>,
        MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([[noun1, noun2]])
      );
      const nouns2: MutableProject<MockNominative<number>, MockNominative<number>> = nouns1.set(noun1, noun3);

      expect(nouns1).toBe(nouns2);
      expect(nouns1.size()).toBe(1);
      expect(nouns2.get(noun1)).toBe(noun3);
    });
  });

  describe('remove', () => {
    it('normal case', () => {
      expect.assertions(1);

      const noun: MockNominative<number> = new MockNominative<number>(1);

      const nouns1: MutableProject<MockNominative<number>, MockNominative<number>> = MutableProject.empty<MockNominative<number>,
        MockNominative<number>>();

      expect(nouns1.remove(noun)).toBe(nouns1);
    });

    it('does nothing because the key is already nothing', () => {
      expect.assertions(1);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);

      const nouns1: MutableProject<MockNominative<number>, MockNominative<number>> = MutableProject.of<MockNominative<number>,
        MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([[noun1, noun2]])
      );

      expect(nouns1.remove(noun3)).toBe(nouns1);
    });

    it('returns the value even if the other', () => {
      expect.assertions(2);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(1);

      const nouns1: MutableProject<MockNominative<number>, MockNominative<number>> = MutableProject.of<MockNominative<number>,
        MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([[noun1, noun2]])
      );
      const nouns2: MutableProject<MockNominative<number>, MockNominative<number>> = nouns1.remove(noun3);

      expect(nouns1).toBe(nouns2);
      expect(nouns1.size()).toBe(0);
    });

    it('does not contains the value, returns itself', () => {
      expect.assertions(1);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);

      const nouns1: MutableProject<MockNominative<number>, MockNominative<number>> = MutableProject.of<MockNominative<number>,
        MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([[noun1, noun2]])
      );

      expect(nouns1.remove(noun3)).toBe(nouns1);
    });
  });

  describe('duplicate', () => {
    it('normal case', () => {
      expect.assertions(2);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(4);

      const nouns1: MutableProject<MockNominative<number>, MockNominative<number>> = MutableProject.of<MockNominative<number>,
        MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([
          [noun1, noun2],
          [noun3, noun4]
        ])
      );
      const nouns2: MutableProject<MockNominative<number>, MockNominative<number>> = nouns1.duplicate();

      expect(nouns1.size()).toBe(nouns2.size());
      expect(nouns1).not.toBe(nouns2);
    });

    it('does not affect original one', () => {
      expect.assertions(4);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(4);

      const nouns1: MutableProject<MockNominative<number>, MockNominative<number>> = MutableProject.of<MockNominative<number>,
        MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([[noun1, noun2]])
      );
      const nouns2: MutableProject<MockNominative<number>, MockNominative<number>> = nouns1.duplicate();
      const nouns3: MutableProject<MockNominative<number>, MockNominative<number>> = nouns2.set(noun3, noun4);

      expect(nouns1.size()).not.toBe(nouns2.size());
      expect(nouns2.size()).toBe(nouns3.size());
      expect(nouns1).not.toBe(nouns2);
      expect(nouns2).toBe(nouns3);
    });

    it('returns MutableProject.empty() when there are no items', () => {
      expect.assertions(1);

      const nouns1: MutableProject<MockNominative<number>, MockNominative<number>> = MutableProject.of<MockNominative<number>,
        MockNominative<number>>(new Map<MockNominative<number>, MockNominative<number>>([]));

      expect(nouns1.duplicate()).not.toBe(nouns1);
    });
  });
});
