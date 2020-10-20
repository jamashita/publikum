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
      sequence.forEach((v: MockNominative<number>) => {
        expect(copied.contains(v)).toBe(true);
      });

      sequence.add(new MockNominative<number>(3));

      expect(sequence.size()).not.toBe(copied.size());
    });
  });

  describe('ofArray', () => {
    it('returns MutableSequence.empty() when set size is 0', () => {
      expect.assertions(1);

      const sequence: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([]);

      expect(sequence.isEmpty()).toBe(true);
    });

    it('returns instance', () => {
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
    it('does not return singleton instance', () => {
      expect.assertions(1);

      expect(MutableSequence.empty<MockNominative<number>>()).not.toBe(MutableSequence.empty<MockNominative<number>>());
    });

    it('always returns 0-size array', () => {
      expect.assertions(1);

      expect(MutableSequence.empty<MockNominative<number>>().isEmpty()).toBe(true);
    });
  });

  describe('add', () => {
    it('can extend mutably', () => {
      expect.assertions(13);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);

      const sequence1: MutableSequence<MockNominative<number>> = MutableSequence.empty<MockNominative<number>>();

      expect(sequence1.size()).toBe(0);

      const sequence2: MutableSequence<MockNominative<number>> = sequence1.add(value1);

      expect(sequence1).toBe(sequence2);
      expect(sequence2.get(0)).toBe(value1);

      const sequence3: MutableSequence<MockNominative<number>> = sequence2.add(value2);

      expect(sequence1).toBe(sequence2);
      expect(sequence2).toBe(sequence3);
      expect(sequence3.get(0)).toBe(value1);
      expect(sequence3.get(1)).toBe(value2);

      const sequence4: MutableSequence<MockNominative<number>> = sequence3.add(value3);

      expect(sequence2).toBe(sequence3);
      expect(sequence3).toBe(sequence4);
      expect(sequence1).toBe(sequence2);
      expect(sequence4.get(0)).toBe(value1);
      expect(sequence4.get(1)).toBe(value2);
      expect(sequence4.get(2)).toBe(value3);
    });
  });

  describe('set', () => {
    it('can be set the value into first position', () => {
      expect.assertions(5);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);
      const value4: MockNominative<number> = new MockNominative<number>(4);

      const sequence1: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        value1,
        value2,
        value3
      ]);
      const sequence2: MutableSequence<MockNominative<number>> = sequence1.set(0, value4);

      expect(sequence1).toBe(sequence2);
      expect(sequence1.size()).toBe(3);
      expect(sequence2.get(0)).toBe(value4);
      expect(sequence2.get(1)).toBe(value2);
      expect(sequence2.get(2)).toBe(value3);
    });

    it('can be set the value into middle position', () => {
      expect.assertions(5);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);
      const value4: MockNominative<number> = new MockNominative<number>(4);

      const sequence1: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        value1,
        value2,
        value3
      ]);
      const sequence2: MutableSequence<MockNominative<number>> = sequence1.set(1, value4);

      expect(sequence1).toBe(sequence2);
      expect(sequence1.size()).toBe(3);
      expect(sequence2.get(0)).toBe(value1);
      expect(sequence2.get(1)).toBe(value4);
      expect(sequence2.get(2)).toBe(value3);
    });

    it('can be set the value into last position', () => {
      expect.assertions(5);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);
      const value4: MockNominative<number> = new MockNominative<number>(4);

      const sequence1: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        value1,
        value2,
        value3
      ]);
      const sequence2: MutableSequence<MockNominative<number>> = sequence1.set(2, value4);

      expect(sequence1).toBe(sequence2);
      expect(sequence1.size()).toBe(3);
      expect(sequence2.get(0)).toBe(value1);
      expect(sequence2.get(1)).toBe(value2);
      expect(sequence2.get(2)).toBe(value4);
    });

    it('returns itself when given key is less than 0', () => {
      expect.assertions(2);

      const value: MockNominative<number> = new MockNominative<number>(1);

      const sequence1: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([]);
      const beforeLength: number = sequence1.size();

      const sequence2: MutableSequence<MockNominative<number>> = sequence1.set(-1, value);

      expect(sequence1).toBe(sequence2);
      expect(sequence1.size()).toBe(beforeLength);
    });

    it('returns itself when given key is greater than sequence length', () => {
      expect.assertions(2);

      const value: MockNominative<number> = new MockNominative<number>(1);

      const sequence1: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([]);
      const beforeLength: number = sequence1.size();

      const sequence2: MutableSequence<MockNominative<number>> = sequence1.set(300, value);

      expect(sequence1).toBe(sequence2);
      expect(sequence1.size()).toBe(beforeLength);
    });

    it('returns itself when given key is not integer', () => {
      expect.assertions(2);

      const value: MockNominative<number> = new MockNominative<number>(1);

      const sequence1: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([]);
      const beforeLength: number = sequence1.size();

      const sequence2: MutableSequence<MockNominative<number>> = sequence1.set(0.9, value);

      expect(sequence1).toBe(sequence2);
      expect(sequence1.size()).toBe(beforeLength);
    });
  });

  describe('remove', () => {
    it('can remove retaining value if it contains', () => {
      expect.assertions(2);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);

      const sequence1: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        value1,
        value2,
        value3
      ]);
      const sequence2: MutableSequence<MockNominative<number>> = sequence1.remove(0);

      expect(sequence1).toBe(sequence2);
      expect(sequence1.size()).toBe(2);
    });

    it('removes middle value', () => {
      expect.assertions(4);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);

      const sequence1: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        value1,
        value2,
        value3
      ]);
      const sequence2: MutableSequence<MockNominative<number>> = sequence1.remove(1);

      expect(sequence1).toBe(sequence2);
      expect(sequence1.size()).toBe(2);
      expect(sequence2.get(0)).toBe(value1);
      expect(sequence2.get(1)).toBe(value3);
    });

    it('removes last value', () => {
      expect.assertions(4);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);

      const sequence1: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        value1,
        value2,
        value3
      ]);
      const sequence2: MutableSequence<MockNominative<number>> = sequence1.remove(2);

      expect(sequence1).toBe(sequence2);
      expect(sequence1.size()).toBe(2);
      expect(sequence2.get(0)).toBe(value1);
      expect(sequence2.get(1)).toBe(value2);
    });

    it('returns itself when give key is greater than sequence length', () => {
      expect.assertions(1);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);

      const sequence1: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        value1,
        value2,
        value3
      ]);
      const sequence2: MutableSequence<MockNominative<number>> = sequence1.remove(3);

      expect(sequence1).toBe(sequence2);
    });

    it('returns itself when give key is less than 0', () => {
      expect.assertions(1);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);

      const sequence1: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        value1,
        value2,
        value3
      ]);
      const sequence2: MutableSequence<MockNominative<number>> = sequence1.remove(-1);

      expect(sequence1).toBe(sequence2);
    });

    it('returns itself when give key is not integer', () => {
      expect.assertions(1);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);

      const sequence1: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        value1,
        value2,
        value3
      ]);
      const sequence2: MutableSequence<MockNominative<number>> = sequence1.remove(0.9);

      expect(sequence1).toBe(sequence2);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the value size is 0', () => {
      expect.assertions(2);

      const sequence1: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(2)
      ]);
      const sequence2: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([]);

      expect(sequence1.isEmpty()).toBe(false);
      expect(sequence2.isEmpty()).toBe(true);
    });
  });

  describe('map', () => {
    it('execute the mapper function and returns mapped Address immutably', () => {
      expect.assertions(5);

      const sequence1: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(2),
        new MockNominative<number>(3)
      ]);
      const sequence2: MutableSequence<MockNominative<string>> = sequence1.map<MockNominative<string>>(
        (value: MockNominative<number>) => {
          const num: number = value.get();

          return new MockNominative<string>(`${num ** 2}`);
        }
      );

      expect(sequence1.size()).toBe(sequence2.size());
      expect(sequence1).not.toBe(sequence2);
      sequence2.forEach((v: MockNominative<string>, k: number) => {
        const mock: Nullable<MockNominative<number>> = sequence1.get(k);

        if (mock === null) {
          fail();
          return;
        }

        const value: number = mock.get() ** 2;

        expect(v.get()).toBe(value.toString());
      });
    });
  });

  describe('filter', () => {
    it('can remove unexpected values', () => {
      expect.assertions(6);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);
      const value4: MockNominative<number> = new MockNominative<number>(2);
      const value5: MockNominative<number> = new MockNominative<number>(5);

      const sequence: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        value1,
        value2,
        value3,
        value4
      ]);

      const filtered1: MutableSequence<MockNominative<number>> = sequence.filter((mock: MockNominative<number>) => {
        return mock.get() % 2 === 0;
      });
      const filtered2: MutableSequence<MockNominative<number>> = sequence.filter((mock: MockNominative<number>) => {
        return mock === value4;
      });
      const filtered3: MutableSequence<MockNominative<number>> = sequence.filter((mock: MockNominative<number>) => {
        return mock === value5;
      });

      expect(filtered1.size()).toBe(2);
      expect(filtered1.get(0)).toBe(value2);
      expect(filtered1.get(1)).toBe(value4);
      expect(filtered2.size()).toBe(1);
      expect(filtered2.get(0)).toBe(value4);
      expect(filtered3.size()).toBe(0);
    });
  });

  describe('duplicate', () => {
    it('returns shallow-copied instance', () => {
      expect.assertions(6);

      const sequence1: MutableSequence<MockNominative<number>> = MutableSequence.ofArray<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(2),
        new MockNominative<number>(3),
        new MockNominative<number>(2)
      ]);
      const sequence2: MutableSequence<MockNominative<number>> = sequence1.duplicate();

      expect(sequence1.size()).toBe(sequence2.size());
      expect(sequence1).not.toBe(sequence2);
      sequence1.forEach((v: MockNominative<number>, k: number) => {
        expect(v).toBe(sequence2.get(k));
      });
    });
  });
});
