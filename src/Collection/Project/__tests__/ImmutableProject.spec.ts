import { MockNominative } from '../../../Mock';
import { ImmutableProject } from '../ImmutableProject';

describe('ImmutableProject', () => {
  describe('of', () => {
    it('when the arguments specified with 0 length set, returns ImmutableAddress.empty()', () => {
      const project: ImmutableProject<MockNominative<number>, MockNominative<number>> = ImmutableProject.of<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>()
      );

      expect(project.isEmpty()).toBe(true);
      expect(project).toBe(ImmutableProject.empty<MockNominative<number>, MockNominative<number>>());
    });

    it('normal case', () => {
      const project1: ImmutableProject<MockNominative<number>, MockNominative<number>> = ImmutableProject.of<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([
          [new MockNominative<number>(1), new MockNominative<number>(2)],
          [new MockNominative<number>(5), new MockNominative<number>(6)]
        ])
      );
      const project2: ImmutableProject<MockNominative<number>, MockNominative<number>> = ImmutableProject.of<MockNominative<number>, MockNominative<number>>(
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
      const project: ImmutableProject<MockNominative<number>, MockNominative<number>> = ImmutableProject.empty<MockNominative<number>, MockNominative<number>>();

      expect(project.size()).toBe(0);
    });

    it('returns singleton empty Address', () => {
      expect(ImmutableProject.empty<MockNominative<number>, MockNominative<number>>()).toBe(ImmutableProject.empty<MockNominative<number>, MockNominative<number>>());
    });
  });

  describe('set', () => {
    it('can extend immutably', () => {
      const project1: ImmutableProject<MockNominative<number>, MockNominative<number>> = ImmutableProject.of<MockNominative<number>, MockNominative<number>>(
        new Map<MockNominative<number>, MockNominative<number>>([
          [new MockNominative<number>(1), new MockNominative<number>(2)],
          [new MockNominative<number>(5), new MockNominative<number>(6)]
        ])
      );
      const project2: ImmutableProject<MockNominative<number>, MockNominative<number>> = ImmutableProject.of<MockNominative<number>, MockNominative<number>>(
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
});
