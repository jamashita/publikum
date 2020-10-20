import { MockNominative } from '@jamashita/publikum-object';
import { Nullable } from '@jamashita/publikum-type';
import { ImmutableSequence } from '../ImmutableSequence';

describe('ImmutableSequence', () => {
  describe('of', () => {
    it('returns copied collection, does not use the same one', () => {
      expect.assertions(4);

      const sequence: ImmutableSequence<MockNominative<number>> = ImmutableSequence.ofArray<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(2)
      ]);
      const copied: ImmutableSequence<MockNominative<number>> = ImmutableSequence.of<MockNominative<number>>(sequence);

      expect(sequence.size()).toBe(copied.size());
      sequence.forEach((v: MockNominative<number>, k: number) => {
        expect(v).toBe(copied.get(k));
      });

      sequence.add(new MockNominative<number>(3));

      expect(sequence.size()).toBe(copied.size());
    });
  });

  describe('ofArray', () => {
    it('returns ImmutableSequence.empty() when the size is 0', () => {
      expect.assertions(2);

      const sequence: ImmutableSequence<MockNominative<number>> = ImmutableSequence.ofArray<MockNominative<number>>([]);

      expect(sequence.isEmpty()).toBe(true);
      expect(sequence).toBe(ImmutableSequence.empty<MockNominative<number>>());
    });

    it('returns instance', () => {
      expect.assertions(2);

      const sequence1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.ofArray<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(3)
      ]);
      const sequence2: ImmutableSequence<MockNominative<number>> = ImmutableSequence.ofArray<MockNominative<number>>([
        new MockNominative<number>(2),
        new MockNominative<number>(4),
        new MockNominative<number>(5)
      ]);

      expect(sequence1.size()).toBe(2);
      expect(sequence2.size()).toBe(3);
    });
  });

  describe('empty', () => {
    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(ImmutableSequence.empty<MockNominative<number>>()).toBe(ImmutableSequence.empty<MockNominative<string>>());
    });

    it('always returns 0-size array', () => {
      expect.assertions(1);

      expect(ImmutableSequence.empty<MockNominative<number>>().isEmpty()).toBe(true);
    });
  });

  describe('add', () => {
    it('can extend immutably', () => {
      expect.assertions(13);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);

      const sequence1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.empty<MockNominative<number>>();

      expect(sequence1.size()).toBe(0);

      const sequence2: ImmutableSequence<MockNominative<number>> = sequence1.add(value1);

      expect(sequence1).not.toBe(sequence2);
      expect(sequence1.size()).toBe(0);
      expect(sequence2.size()).toBe(1);
      expect(sequence2.get(0)).toBe(value1);

      const sequence3: ImmutableSequence<MockNominative<number>> = sequence2.add(value2);

      expect(sequence1).not.toBe(sequence2);
      expect(sequence2).not.toBe(sequence3);
      expect(sequence3).not.toBe(sequence1);
      expect(sequence1.size()).toBe(0);
      expect(sequence2.size()).toBe(1);
      expect(sequence3.size()).toBe(2);
      expect(sequence3.get(0)).toBe(value1);
      expect(sequence3.get(1)).toBe(value2);
    });
  });

  describe('set', () => {
    it('can be set the value into first position', () => {
      expect.assertions(6);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);
      const value4: MockNominative<number> = new MockNominative<number>(4);

      const sequence1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.ofArray<MockNominative<number>>([
        value1,
        value2,
        value3
      ]);
      const sequence2: ImmutableSequence<MockNominative<number>> = sequence1.set(0, value4);

      expect(sequence1).not.toBe(sequence2);
      expect(sequence1.size()).toBe(3);
      expect(sequence2.size()).toBe(3);
      expect(sequence2.get(0)).toBe(value4);
      expect(sequence2.get(1)).toBe(value2);
      expect(sequence2.get(2)).toBe(value3);
    });

    it('can be set the value into middle position', () => {
      expect.assertions(6);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);
      const value4: MockNominative<number> = new MockNominative<number>(4);

      const sequence1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.ofArray<MockNominative<number>>([
        value1,
        value2,
        value3
      ]);
      const sequence2: ImmutableSequence<MockNominative<number>> = sequence1.set(1, value4);

      expect(sequence1).not.toBe(sequence2);
      expect(sequence1.size()).toBe(3);
      expect(sequence2.size()).toBe(3);
      expect(sequence2.get(0)).toBe(value1);
      expect(sequence2.get(1)).toBe(value4);
      expect(sequence2.get(2)).toBe(value3);
    });

    it('can be set the value into last position', () => {
      expect.assertions(6);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);
      const value4: MockNominative<number> = new MockNominative<number>(4);

      const sequence1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.ofArray<MockNominative<number>>([
        value1,
        value2,
        value3
      ]);
      const sequence2: ImmutableSequence<MockNominative<number>> = sequence1.set(2, value4);

      expect(sequence1).not.toBe(sequence2);
      expect(sequence1.size()).toBe(3);
      expect(sequence2.size()).toBe(3);
      expect(sequence2.get(0)).toBe(value1);
      expect(sequence2.get(1)).toBe(value2);
      expect(sequence2.get(2)).toBe(value4);
    });

    it('returns itself when given key is less than 0', () => {
      expect.assertions(1);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);
      const value4: MockNominative<number> = new MockNominative<number>(4);

      const sequence1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.ofArray<MockNominative<number>>([
        value1,
        value2,
        value3
      ]);
      const sequence2: ImmutableSequence<MockNominative<number>> = sequence1.set(-1, value4);

      expect(sequence1).toBe(sequence2);
    });

    it('returns itself when given key is greater than sequence length', () => {
      expect.assertions(1);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);
      const value4: MockNominative<number> = new MockNominative<number>(4);

      const sequence1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.ofArray<MockNominative<number>>([
        value1,
        value2,
        value3
      ]);

      const sequence2: ImmutableSequence<MockNominative<number>> = sequence1.set(sequence1.size(), value4);

      expect(sequence1).toBe(sequence2);
    });

    it('returns itself when given key is not integer', () => {
      expect.assertions(1);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);
      const value4: MockNominative<number> = new MockNominative<number>(4);

      const sequence1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.ofArray<MockNominative<number>>([
        value1,
        value2,
        value3
      ]);

      const sequence2: ImmutableSequence<MockNominative<number>> = sequence1.set(2.2, value4);

      expect(sequence1).toBe(sequence2);
    });
  });

  describe('remove', () => {
    it('can remove retaining value if it contains', () => {
      expect.assertions(5);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);

      const sequence1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.ofArray<MockNominative<number>>([
        value1,
        value2,
        value3
      ]);

      const sequence2: ImmutableSequence<MockNominative<number>> = sequence1.remove(0);

      expect(sequence1).not.toBe(sequence2);
      expect(sequence1.size()).toBe(3);
      expect(sequence2.size()).toBe(2);
      expect(sequence2.get(0)).toBe(value2);
      expect(sequence2.get(1)).toBe(value3);
    });

    it('removes middle value', () => {
      expect.assertions(5);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);

      const sequence1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.ofArray<MockNominative<number>>([
        value1,
        value2,
        value3
      ]);
      const sequence2: ImmutableSequence<MockNominative<number>> = sequence1.remove(1);

      expect(sequence1).not.toBe(sequence2);
      expect(sequence1.size()).toBe(3);
      expect(sequence2.size()).toBe(2);
      expect(sequence2.get(0)).toBe(value1);
      expect(sequence2.get(1)).toBe(value3);
    });

    it('removes last value', () => {
      expect.assertions(5);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);

      const sequence1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.ofArray<MockNominative<number>>([
        value1,
        value2,
        value3
      ]);
      const sequence2: ImmutableSequence<MockNominative<number>> = sequence1.remove(2);

      expect(sequence1).not.toBe(sequence2);
      expect(sequence1.size()).toBe(3);
      expect(sequence2.size()).toBe(2);
      expect(sequence2.get(0)).toBe(value1);
      expect(sequence2.get(1)).toBe(value2);
    });

    it('returns itself when give key is greater than sequence length', () => {
      expect.assertions(1);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);

      const sequence1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.ofArray<MockNominative<number>>([
        value1,
        value2,
        value3
      ]);
      const sequence2: ImmutableSequence<MockNominative<number>> = sequence1.remove(3);

      expect(sequence1).toBe(sequence2);
    });

    it('returns itself when give key is less than 0', () => {
      expect.assertions(1);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);

      const sequence1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.ofArray<MockNominative<number>>([
        value1,
        value2,
        value3
      ]);
      const sequence2: ImmutableSequence<MockNominative<number>> = sequence1.remove(-1);

      expect(sequence1).toBe(sequence2);
    });

    it('returns itself when give key is not integer', () => {
      expect.assertions(1);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);

      const sequence1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.ofArray<MockNominative<number>>([
        value1,
        value2,
        value3
      ]);
      const sequence2: ImmutableSequence<MockNominative<number>> = sequence1.remove(0.8);

      expect(sequence1).toBe(sequence2);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the value size is 0', () => {
      expect.assertions(2);

      const sequence1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.ofArray<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(2)
      ]);
      const sequence2: ImmutableSequence<MockNominative<number>> = ImmutableSequence.ofArray<MockNominative<number>>([]);

      expect(sequence1.isEmpty()).toBe(false);
      expect(sequence2.isEmpty()).toBe(true);
    });
  });

  describe('map', () => {
    it('execute the mapper function and returns mapped Address immutably', () => {
      expect.assertions(5);

      const sequence1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.ofArray<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(2),
        new MockNominative<number>(3)
      ]);
      const sequence2: ImmutableSequence<MockNominative<string>> = sequence1.map<MockNominative<string>>(
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

      const sequence: ImmutableSequence<MockNominative<number>> = ImmutableSequence.ofArray<MockNominative<number>>([
        value1,
        value2,
        value3,
        value4
      ]);

      const filtered1: ImmutableSequence<MockNominative<number>> = sequence.filter((mock: MockNominative<number>) => {
        return mock.get() % 2 === 0;
      });
      const filtered2: ImmutableSequence<MockNominative<number>> = sequence.filter((mock: MockNominative<number>) => {
        return mock === value4;
      });
      const filtered3: ImmutableSequence<MockNominative<number>> = sequence.filter((mock: MockNominative<number>) => {
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

      const sequence1: ImmutableSequence<MockNominative<number>> = ImmutableSequence.ofArray<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(2),
        new MockNominative<number>(3),
        new MockNominative<number>(2)
      ]);
      const sequence2: ImmutableSequence<MockNominative<number>> = sequence1.duplicate();

      expect(sequence1.size()).toBe(sequence2.size());
      expect(sequence1).not.toBe(sequence2);
      sequence1.forEach((v: MockNominative<number>, k: number) => {
        expect(v).toBe(sequence2.get(k));
      });
    });
  });
});
