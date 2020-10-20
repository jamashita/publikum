import { MockNominative } from '@jamashita/publikum-object';
import { Nullable } from '@jamashita/publikum-type';
import { MutableSequence } from '../MutableSequence';

describe('MutableSequence', () => {
  describe('of', () => {
    it('returns copied collection, does not use the same one', () => {
      expect.assertions(4);

      const sequence: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(2)
      ]);
      const copied: MutableSequence<MockNominative<number>> = MutableSequence.of<MockNominative<number>>(sequence);

      expect(sequence.size()).toBe(copied.size());
      expect(sequence.get(0)).toBe(copied.get(0));
      expect(sequence.get(1)).toBe(copied.get(1));

      sequence.add(new MockNominative<number>(3));

      expect(sequence.size()).not.toBe(copied.size());
    });
  });

  describe('ofArray', () => {
    it('normal case', () => {
      expect.assertions(2);

      const sequence1: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(3)
      ]);
      const sequence2: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        new MockNominative<number>(2),
        new MockNominative<number>(4),
        new MockNominative<number>(5)
      ]);

      expect(sequence1.size()).toBe(2);
      expect(sequence2.size()).toBe(3);
    });
  });

  describe('empty', () => {
    it('always empty, the length is 0', () => {
      expect.assertions(1);

      expect(MutableSequence.empty<MockNominative<number>>().isEmpty()).toBe(true);
    });

    it('returns different empty Sequence', () => {
      expect.assertions(1);

      expect(MutableSequence.empty<MockNominative<number>>()).not.toBe(MutableSequence.empty<MockNominative<string>>());
    });
  });

  describe('add', () => {
    it('can extend mutably', () => {
      expect.assertions(13);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);

      const nouns1: MutableSequence<MockNominative<number>> = MutableSequence.empty<MockNominative<number>>();

      expect(nouns1.size()).toBe(0);

      const nouns2: MutableSequence<MockNominative<number>> = nouns1.add(noun1);

      expect(nouns1).toBe(nouns2);
      expect(nouns2.get(0)).toBe(noun1);

      const nouns3: MutableSequence<MockNominative<number>> = nouns2.add(noun2);

      expect(nouns1).toBe(nouns2);
      expect(nouns2).toBe(nouns3);
      expect(nouns3.get(0)).toBe(noun1);
      expect(nouns3.get(1)).toBe(noun2);

      const nouns4: MutableSequence<MockNominative<number>> = nouns3.add(noun3);

      expect(nouns2).toBe(nouns3);
      expect(nouns3).toBe(nouns4);
      expect(nouns1).toBe(nouns2);
      expect(nouns4.get(0)).toBe(noun1);
      expect(nouns4.get(1)).toBe(noun2);
      expect(nouns4.get(2)).toBe(noun3);
    });
  });

  describe('set', () => {
    it('set element into first position', () => {
      expect.assertions(5);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(4);

      const nouns1: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        noun1,
        noun2,
        noun3
      ]);

      const nouns2: MutableSequence<MockNominative<number>> = nouns1.set(0, noun4);

      expect(nouns1).toBe(nouns2);
      expect(nouns1.size()).toBe(3);
      expect(nouns2.get(0)).toBe(noun4);
      expect(nouns2.get(1)).toBe(noun2);
      expect(nouns2.get(2)).toBe(noun3);
    });

    it('set element into middle position', () => {
      expect.assertions(5);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(4);

      const nouns1: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        noun1,
        noun2,
        noun3
      ]);

      const nouns2: MutableSequence<MockNominative<number>> = nouns1.set(1, noun4);

      expect(nouns1).toBe(nouns2);
      expect(nouns1.size()).toBe(3);
      expect(nouns2.get(0)).toBe(noun1);
      expect(nouns2.get(1)).toBe(noun4);
      expect(nouns2.get(2)).toBe(noun3);
    });

    it('set element into last position', () => {
      expect.assertions(5);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(4);

      const nouns1: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        noun1,
        noun2,
        noun3
      ]);

      const nouns2: MutableSequence<MockNominative<number>> = nouns1.set(2, noun4);

      expect(nouns1).toBe(nouns2);
      expect(nouns1.size()).toBe(3);
      expect(nouns2.get(0)).toBe(noun1);
      expect(nouns2.get(1)).toBe(noun2);
      expect(nouns2.get(2)).toBe(noun4);
    });

    it('returns itself when give index is greater than sequence length', () => {
      expect.assertions(1);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(4);

      const nouns1: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        noun1,
        noun2,
        noun3
      ]);

      const nouns2: MutableSequence<MockNominative<number>> = nouns1.set(3, noun4);

      expect(nouns1).toBe(nouns2);
    });
  });

  describe('remove', () => {
    it('delete first element', () => {
      expect.assertions(4);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);

      const nouns1: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        noun1,
        noun2,
        noun3
      ]);

      const nouns2: MutableSequence<MockNominative<number>> = nouns1.remove(0);

      expect(nouns1).toBe(nouns2);
      expect(nouns1.size()).toBe(2);
      expect(nouns2.get(0)).toBe(noun2);
      expect(nouns2.get(1)).toBe(noun3);
    });

    it('delete middle element', () => {
      expect.assertions(4);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);

      const nouns1: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        noun1,
        noun2,
        noun3
      ]);

      const nouns2: MutableSequence<MockNominative<number>> = nouns1.remove(1);

      expect(nouns1).toBe(nouns2);
      expect(nouns1.size()).toBe(2);
      expect(nouns2.get(0)).toBe(noun1);
      expect(nouns2.get(1)).toBe(noun3);
    });

    it('delete last element', () => {
      expect.assertions(4);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);

      const nouns1: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        noun1,
        noun2,
        noun3
      ]);

      const nouns2: MutableSequence<MockNominative<number>> = nouns1.remove(2);

      expect(nouns1).toBe(nouns2);
      expect(nouns1.size()).toBe(2);
      expect(nouns2.get(0)).toBe(noun1);
      expect(nouns2.get(1)).toBe(noun2);
    });

    it('returns itself when give index is greater than sequence length', () => {
      expect.assertions(1);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);

      const nouns1: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        noun1,
        noun2,
        noun3
      ]);

      const nouns2: MutableSequence<MockNominative<number>> = nouns1.remove(3);

      expect(nouns1).toBe(nouns2);
    });
  });

  describe('map', () => {
    it('normal case', () => {
      expect.assertions(4);

      const nouns1: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(2),
        new MockNominative<number>(3)
      ]);

      const nouns2: MutableSequence<MockNominative<string>> = nouns1.map<MockNominative<string>>(
        (noun: MockNominative<number>) => {
          const num: number = noun.get();

          return new MockNominative<string>(`${num ** 2}`);
        }
      );

      expect(nouns2.size()).toBe(nouns1.size());
      nouns2.forEach((noun: MockNominative<string>, index: number) => {
        const mock: Nullable<MockNominative<number>> = nouns1.get(index);

        if (mock === null) {
          // eslint-disable-next-line jest/no-jasmine-globals
          fail();
        }

        const value: number = mock.get() ** 2;

        expect(noun.get()).toBe(value.toString());
      });
    });

    it('returns empty sequence when MutableSequence is empty', () => {
      expect.assertions(2);

      const nouns1: MutableSequence<MockNominative<number>> = MutableSequence.empty<MockNominative<number>>();
      const nouns2: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([]);

      const map1: MutableSequence<MockNominative<number>> = nouns1.map((mock: MockNominative<number>) => {
        return mock;
      });
      const map2: MutableSequence<MockNominative<number>> = nouns2.map((mock: MockNominative<number>) => {
        return mock;
      });

      expect(map1.size()).toBe(0);
      expect(map2.size()).toBe(0);
    });
  });

  describe('filter', () => {
    it('normal case', () => {
      expect.assertions(6);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(2);
      const noun5: MockNominative<number> = new MockNominative<number>(5);

      const nouns: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        noun1,
        noun2,
        noun3,
        noun4
      ]);

      const filtered1: MutableSequence<MockNominative<number>> = nouns.filter((mock: MockNominative<number>) => {
        return mock.get() % 2 === 0;
      });
      const filtered2: MutableSequence<MockNominative<number>> = nouns.filter((mock: MockNominative<number>) => {
        return mock === noun4;
      });
      const filtered3: MutableSequence<MockNominative<number>> = nouns.filter((mock: MockNominative<number>) => {
        return mock === noun5;
      });

      expect(filtered1.size()).toBe(2);
      expect(filtered1.get(0)).toBe(noun2);
      expect(filtered1.get(1)).toBe(noun4);
      expect(filtered2.size()).toBe(1);
      expect(filtered2.get(0)).toBe(noun4);
      expect(filtered3.size()).toBe(0);
    });

    it('returns empty sequence when screen returns nothing', () => {
      expect.assertions(1);

      const nouns: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(2),
        new MockNominative<number>(3),
        new MockNominative<number>(2)
      ]);

      const filtered: MutableSequence<MockNominative<number>> = nouns.filter(() => {
        return false;
      });

      expect(filtered.size()).toBe(0);
    });
  });

  describe('duplicate', () => {
    it('normal case', () => {
      expect.assertions(6);

      const nouns1: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(2),
        new MockNominative<number>(3),
        new MockNominative<number>(2)
      ]);
      const nouns2: MutableSequence<MockNominative<number>> = nouns1.duplicate();

      expect(nouns1.size()).toBe(nouns2.size());
      expect(nouns1).not.toBe(nouns2);
      for (let i: number = 0; i < nouns2.size(); i++) {
        expect(nouns1.get(i)).toBe(nouns2.get(i));
      }
    });

    it('does not affect original one', () => {
      expect.assertions(4);

      const nouns1: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(2),
        new MockNominative<number>(3)
      ]);
      const nouns2: MutableSequence<MockNominative<number>> = nouns1.duplicate();
      const nouns3: MutableSequence<MockNominative<number>> = nouns2.add(new MockNominative<number>(2));

      expect(nouns1.size()).not.toBe(nouns2.size());
      expect(nouns2.size()).toBe(nouns3.size());
      expect(nouns1).not.toBe(nouns2);
      expect(nouns2).toBe(nouns3);
    });

    it('returns MutableSequence.empty() when there are no items', () => {
      expect.assertions(1);

      const nouns: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([]);

      expect(nouns.duplicate()).not.toBe(nouns);
    });
  });
});
