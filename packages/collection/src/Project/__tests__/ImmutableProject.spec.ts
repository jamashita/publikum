import { MockNominative } from '@jamashita/publikum-object';
import { ImmutableProject } from '../ImmutableProject';

describe('ImmutableProject', () => {
  describe('of', () => {
    it('returns copied collection, does not use the same one', () => {
      expect.assertions(6);

      const project: ImmutableProject<MockNominative<number>, MockNominative<number>> = ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([
          [new MockNominative<number>(1), new MockNominative<number>(2)],
          [new MockNominative<number>(3), new MockNominative<number>(4)]
        ])
      );
      const copied: ImmutableProject<MockNominative<number>, MockNominative<number>> = ImmutableProject.of<MockNominative<number>, MockNominative<number>>(project);

      expect(project.size()).toBe(copied.size());
      project.forEach((v: MockNominative<number>, k: MockNominative<number>) => {
        expect(copied.has(k)).toBe(true);
        expect(copied.contains(v)).toBe(true);
      });

      project.set(new MockNominative<number>(5), new MockNominative<number>(6));

      expect(project.size()).toBe(copied.size());
    });
  });

  describe('ofMap', () => {
    it('returns ImmutableProject.empty() when the size is 0', () => {
      expect.assertions(2);

      const project: ImmutableProject<MockNominative<number>, MockNominative<number>> = ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>()
      );

      expect(project.isEmpty()).toBe(true);
      expect(project).toBe(ImmutableProject.empty<MockNominative<number>, MockNominative<number>>());
    });

    it('returns instance', () => {
      expect.assertions(2);

      const project1: ImmutableProject<MockNominative<number>, MockNominative<number>> = ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([
          [new MockNominative<number>(1), new MockNominative<number>(2)],
          [new MockNominative<number>(5), new MockNominative<number>(6)]
        ])
      );
      const project2: ImmutableProject<MockNominative<number>, MockNominative<number>> = ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(
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
    it('returns singleton singleton instance', () => {
      expect.assertions(1);

      expect(ImmutableProject.empty<MockNominative<number>, MockNominative<number>>()).toBe(ImmutableProject.empty<MockNominative<number>, MockNominative<number>>());
    });

    it('always returns 0-size map', () => {
      expect.assertions(1);

      const project: ImmutableProject<MockNominative<number>, MockNominative<number>> = ImmutableProject.empty<MockNominative<number>, MockNominative<number>>();

      expect(project.size()).toBe(0);
    });
  });

  describe('set', () => {
    it('can extend immutably', () => {
      expect.assertions(10);

      const key1: MockNominative<number> = new MockNominative<number>(1);
      const key2: MockNominative<number> = new MockNominative<number>(3);

      const value1: MockNominative<number> = new MockNominative<number>(2);
      const value2: MockNominative<number> = new MockNominative<number>(4);

      const project1: ImmutableProject<MockNominative<number>, MockNominative<number>> = ImmutableProject.empty<MockNominative<number>, MockNominative<number>>();

      expect(project1.size()).toBe(0);

      const project2: ImmutableProject<MockNominative<number>, MockNominative<number>> = project1.set(key1, value1);

      expect(project1).not.toBe(project2);
      expect(project1.size()).toBe(0);
      expect(project2.size()).toBe(1);

      const project3: ImmutableProject<MockNominative<number>, MockNominative<number>> = project2.set(key2, value2);

      expect(project1).not.toBe(project2);
      expect(project2).not.toBe(project3);
      expect(project3).not.toBe(project1);
      expect(project1.size()).toBe(0);
      expect(project2.size()).toBe(1);
      expect(project3.size()).toBe(2);
    });

    it('overwrites when the keys are already contained', () => {
      expect.assertions(4);

      const key1: MockNominative<number> = new MockNominative<number>(1);

      const value1: MockNominative<number> = new MockNominative<number>(2);
      const value2: MockNominative<number> = new MockNominative<number>(3);

      const project1: ImmutableProject<MockNominative<number>, MockNominative<number>> = ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([[key1, value1]])
      );
      const project2: ImmutableProject<MockNominative<number>, MockNominative<number>> = project1.set(key1, value2);

      expect(project1).not.toBe(project2);
      expect(project1.size()).toBe(1);
      expect(project2.size()).toBe(1);
      expect(project2.get(key1)).toBe(value2);
    });

    it('stores key-value when the keys are not contained yet', () => {
      expect.assertions(5);

      const key1: MockNominative<number> = new MockNominative<number>(1);
      const key2: MockNominative<number> = new MockNominative<number>(3);

      const value1: MockNominative<number> = new MockNominative<number>(2);
      const value2: MockNominative<number> = new MockNominative<number>(3);

      const project1: ImmutableProject<MockNominative<number>, MockNominative<number>> = ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([[key1, value1]])
      );
      const project2: ImmutableProject<MockNominative<number>, MockNominative<number>> = project1.set(key2, value2);

      expect(project1).not.toBe(project2);
      expect(project1.size()).toBe(1);
      expect(project2.size()).toBe(2);
      expect(project2.get(key1)).toBe(value1);
      expect(project2.get(key2)).toBe(value2);
    });
  });

  describe('remove', () => {
    it('can remove retaining value if it contains', () => {
      expect.assertions(2);

      const key: MockNominative<number> = new MockNominative<number>(1);

      const value: MockNominative<number> = new MockNominative<number>(2);

      const project1: ImmutableProject<MockNominative<number>, MockNominative<number>> = ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([[key, value]])
      );
      const project2: ImmutableProject<MockNominative<number>, MockNominative<number>> = project1.remove(key);

      expect(project1.size()).toBe(1);
      expect(project2.size()).toBe(0);
    });

    it('does nothing where there is no such key', () => {
      expect.assertions(2);

      const key1: MockNominative<number> = new MockNominative<number>(1);
      const key2: MockNominative<number> = new MockNominative<number>(2);

      const value: MockNominative<number> = new MockNominative<number>(2);

      const project: ImmutableProject<MockNominative<number>, MockNominative<number>> = ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([[key1, value]])
      );
      const beforeLength: number = project.size();

      expect(project.remove(key2)).toBe(project);
      expect(project.size()).toBe(beforeLength);
    });

    it('returns the removed Project', () => {
      expect.assertions(3);

      const key1: MockNominative<number> = new MockNominative<number>(1);
      const key2: MockNominative<number> = new MockNominative<number>(1);

      const value: MockNominative<number> = new MockNominative<number>(2);

      const project1: ImmutableProject<MockNominative<number>, MockNominative<number>> = ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([[key1, value]])
      );
      const project2: ImmutableProject<MockNominative<number>, MockNominative<number>> = project1.remove(key2);

      expect(project1).not.toBe(project2);
      expect(project1.size()).toBe(1);
      expect(project2.size()).toBe(0);
    });

    it('returns ImmutableProject.empty() when the size will be 0', () => {
      expect.assertions(1);

      const key: MockNominative<number> = new MockNominative<number>(1);

      const value: MockNominative<number> = new MockNominative<number>(2);

      const project1: ImmutableProject<MockNominative<number>, MockNominative<number>> = ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([[key, value]])
      );
      const project2: ImmutableProject<MockNominative<number>, MockNominative<number>> = project1.remove(key);

      expect(project2).toBe(ImmutableProject.empty<MockNominative<number>, MockNominative<number>>());
    });
  });

  describe('isEmpty', () => {
    it('returns true if the value size is 0', () => {
      expect.assertions(2);

      const key: MockNominative<number> = new MockNominative<number>(1);

      const value: MockNominative<number> = new MockNominative<number>(2);

      const project1: ImmutableProject<MockNominative<number>, MockNominative<number>> = ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([[key, value]])
      );
      const project2: ImmutableProject<MockNominative<number>, MockNominative<number>> = ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([])
      );

      expect(project1.isEmpty()).toBe(false);
      expect(project2.isEmpty()).toBe(true);
    });
  });

  describe('map', () => {
    it('execute the mapper function and returns mapped Address immutably', () => {
      expect.assertions(4);

      const key1: MockNominative<number> = new MockNominative<number>(1);
      const key2: MockNominative<number> = new MockNominative<number>(3);

      const value1: MockNominative<number> = new MockNominative<number>(2);
      const value2: MockNominative<number> = new MockNominative<number>(4);

      const project1: ImmutableProject<MockNominative<number>, MockNominative<number>> = ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([
          [key1, value1],
          [key2, value2]
        ])
      );
      const project2: ImmutableProject<MockNominative<number>, MockNominative<number>> = project1.map<MockNominative<number>>((v: MockNominative<number>) => {
        return new MockNominative(v.get() + 10);
      });

      expect(project1.size()).toBe(project2.size());
      expect(project1).not.toBe(project2);
      project1.forEach((v: MockNominative<number>, k: MockNominative<number>) => {
        expect(project2.get(k)?.get()).toBe(v.get() + 10);
      });
    });
  });

  describe('duplicate', () => {
    it('returns ImmutableProject.empty() when there are no key-value pairs', () => {
      expect.assertions(1);

      const project1: ImmutableProject<MockNominative<number>, MockNominative<number>> = ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([])
      );

      expect(project1.duplicate()).toBe(ImmutableProject.empty<MockNominative<number>, MockNominative<number>>());
    });

    it('returns shallow-copied instance', () => {
      expect.assertions(7);

      const key1: MockNominative<number> = new MockNominative<number>(1);
      const key2: MockNominative<number> = new MockNominative<number>(3);
      const key3: MockNominative<number> = new MockNominative<number>(5);

      const value1: MockNominative<number> = new MockNominative<number>(2);
      const value2: MockNominative<number> = new MockNominative<number>(4);
      const value3: MockNominative<number> = new MockNominative<number>(6);

      const project1: ImmutableProject<MockNominative<number>, MockNominative<number>> = ImmutableProject.ofMap<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([
          [key1, value1],
          [key2, value2]
        ])
      );
      const project2: ImmutableProject<MockNominative<number>, MockNominative<number>> = project1.duplicate();

      expect(project1.size()).toBe(project2.size());
      expect(project1).not.toBe(project2);
      expect(project2).not.toBe(project2.set(key3, value3));
      project1.forEach((v: MockNominative<number>, k: MockNominative<number>) => {
        expect(project2.has(k)).toBe(true);
        expect(project2.contains(v)).toBe(true);
      });
    });
  });
});
