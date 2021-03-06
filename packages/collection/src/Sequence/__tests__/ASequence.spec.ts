import { MockValueObject } from '@jamashita/publikum-object';
import { Nullable, Predicate } from '@jamashita/publikum-type';
import { MockSequence } from '../Mock/MockSequence';

describe('ASequence', () => {
  describe('iterator', () => {
    it('returns [number, MockValueObject<number>]', () => {
      expect.assertions(4);

      const sequence: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>([
        new MockValueObject<number>(1),
        new MockValueObject<number>(2)
      ]);

      let i: number = 0;

      for (const value of sequence) {
        expect(value[0]).toBe(i);
        expect(value[1].get()).toBe(sequence.get(i)?.get());
        i++;
      }
    });
  });

  describe('get', () => {
    it('returns value at the correct key', () => {
      expect.assertions(4);

      const values: Array<MockValueObject<number>> = [
        new MockValueObject<number>(1),
        new MockValueObject<number>(2),
        new MockValueObject<number>(3)
      ];

      const sequence: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>(values);

      expect(sequence.size()).toBe(values.length);
      for (let i: number = 0; i < sequence.size(); i++) {
        expect(sequence.get(i)).toBe(values[i]);
      }
    });

    it('returns null at incorrect keys', () => {
      expect.assertions(2);

      const sequence: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>([
        new MockValueObject<number>(1),
        new MockValueObject<number>(2),
        new MockValueObject<number>(3)
      ]);

      expect(sequence.get(-1)).toBeNull();
      expect(sequence.get(3)).toBeNull();
    });
  });

  describe('contains', () => {
    it('returns false if the value does not exist', () => {
      expect.assertions(1);

      const value1: MockValueObject<number> = new MockValueObject<number>(1);
      const value2: MockValueObject<number> = new MockValueObject<number>(2);
      const value3: MockValueObject<number> = new MockValueObject<number>(3);

      const sequence: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>([value1, value2]);

      expect(sequence.contains(value3)).toBe(false);
    });

    it('returns true if the value exists', () => {
      expect.assertions(3);

      const value1: MockValueObject<number> = new MockValueObject<number>(1);
      const value2: MockValueObject<number> = new MockValueObject<number>(2);
      const value3: MockValueObject<number> = new MockValueObject<number>(2);

      const sequence: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>([value1, value2]);

      expect(sequence.contains(value1)).toBe(true);
      expect(sequence.contains(value2)).toBe(true);
      expect(sequence.contains(value3)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the values does not exist', () => {
      expect.assertions(2);

      const sequence1: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>([
        new MockValueObject<number>(1),
        new MockValueObject<number>(2)
      ]);
      const sequence2: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>([]);

      expect(sequence1.isEmpty()).toBe(false);
      expect(sequence2.isEmpty()).toBe(true);
    });
  });

  describe('forEach', () => {
    it('calls back as much as the size of set', () => {
      expect.assertions(4);

      const sequence: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>([
        new MockValueObject<number>(1),
        new MockValueObject<number>(2),
        new MockValueObject<number>(3)
      ]);

      expect(sequence.size()).toBe(3);
      sequence.forEach((value: MockValueObject<number>, index: number) => {
        expect(sequence.get(index)).toBe(value);
      });
    });
  });

  describe('find', () => {
    it('returns the first found value', () => {
      expect.assertions(4);

      const value1: MockValueObject<number> = new MockValueObject<number>(1);
      const value2: MockValueObject<number> = new MockValueObject<number>(2);
      const value3: MockValueObject<number> = new MockValueObject<number>(3);
      const value4: MockValueObject<number> = new MockValueObject<number>(4);

      const sequence: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>([
        value1,
        value2,
        value3,
        value4
      ]);

      const found1: Nullable<MockValueObject<number>> = sequence.find((v: MockValueObject<number>) => {
        return v.get() === 1;
      });
      const found2: Nullable<MockValueObject<number>> = sequence.find((v: MockValueObject<number>) => {
        return v.get() === 2;
      });
      const found3: Nullable<MockValueObject<number>> = sequence.find((v: MockValueObject<number>) => {
        return v.get() % 2 === 0;
      });
      const found4: Nullable<MockValueObject<number>> = sequence.find((v: MockValueObject<number>) => {
        return v.get() > 1000;
      });

      expect(found1).toBe(value1);
      expect(found2).toBe(value2);
      expect(found3).toBe(value2);
      expect(found4).toBeNull();
    });
  });

  describe('every', () => {
    it('returns true if all the values are the same', () => {
      expect.assertions(1);

      const sequence: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>([
        new MockValueObject<number>(2),
        new MockValueObject<number>(4),
        new MockValueObject<number>(6),
        new MockValueObject<number>(8)
      ]);

      const every: boolean = sequence.every((v: MockValueObject<number>) => {
        return v.get() % 2 === 0;
      });

      expect(every).toBe(true);
    });

    it('returns false if at least one of the values is not false', () => {
      expect.assertions(6);

      const value1: MockValueObject<number> = new MockValueObject<number>(1);
      const value2: MockValueObject<number> = new MockValueObject<number>(4);
      const value3: MockValueObject<number> = new MockValueObject<number>(6);
      const value4: MockValueObject<number> = new MockValueObject<number>(8);
      const value5: MockValueObject<number> = new MockValueObject<number>(3);

      const sequence1: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>([
        value1,
        value2,
        value3,
        value4
      ]);
      const sequence2: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>([
        value2,
        value1,
        value3,
        value4
      ]);
      const sequence3: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>([
        value2,
        value3,
        value1,
        value4
      ]);
      const sequence4: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>([
        value2,
        value3,
        value4,
        value1
      ]);
      const sequence5: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>([
        value1,
        value5,
        value3,
        value4
      ]);
      const sequence6: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>([
        value1,
        value2,
        value5,
        value4
      ]);

      const predicate: Predicate<MockValueObject<number>> = (v: MockValueObject<number>) => {
        return v.get() % 2 === 0;
      };

      const every1: boolean = sequence1.every(predicate);
      const every2: boolean = sequence2.every(predicate);
      const every3: boolean = sequence3.every(predicate);
      const every4: boolean = sequence4.every(predicate);
      const every5: boolean = sequence5.every(predicate);
      const every6: boolean = sequence6.every(predicate);

      expect(every1).toBe(false);
      expect(every2).toBe(false);
      expect(every3).toBe(false);
      expect(every4).toBe(false);
      expect(every5).toBe(false);
      expect(every6).toBe(false);
    });
  });

  describe('some', () => {
    it('returns true if at least one of the values returns true', () => {
      expect.assertions(2);

      const sequence1: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>([
        new MockValueObject<number>(2),
        new MockValueObject<number>(4),
        new MockValueObject<number>(6),
        new MockValueObject<number>(8)
      ]);
      const sequence2: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>([
        new MockValueObject<number>(1),
        new MockValueObject<number>(4),
        new MockValueObject<number>(3),
        new MockValueObject<number>(3)
      ]);

      const predicate: Predicate<MockValueObject<number>> = (v: MockValueObject<number>) => {
        return v.get() % 2 === 0;
      };

      const some1: boolean = sequence1.some(predicate);
      const some2: boolean = sequence2.some(predicate);

      expect(some1).toBe(true);
      expect(some2).toBe(true);
    });

    it('returns false if none of the values are true', () => {
      expect.assertions(1);

      const value1: MockValueObject<number> = new MockValueObject<number>(2);
      const value2: MockValueObject<number> = new MockValueObject<number>(4);
      const value3: MockValueObject<number> = new MockValueObject<number>(6);
      const value4: MockValueObject<number> = new MockValueObject<number>(8);

      const sequence: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>([
        value1,
        value2,
        value3,
        value4
      ]);

      const predicate: Predicate<MockValueObject<number>> = (v: MockValueObject<number>) => {
        return v.get() % 2 === 1;
      };

      const some: boolean = sequence.some(predicate);

      expect(some).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true when the same instance given', () => {
      expect.assertions(1);

      const value: MockValueObject<number> = new MockValueObject<number>(1);

      const sequence: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>([value]);

      expect(sequence.equals(sequence)).toBe(true);
    });

    it('returns false if the size is different', () => {
      expect.assertions(1);

      const value1: MockValueObject<number> = new MockValueObject<number>(1);
      const value2: MockValueObject<number> = new MockValueObject<number>(2);

      const sequence1: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>([value1]);
      const sequence2: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>([value1, value2]);

      expect(sequence1.equals(sequence2)).toBe(false);
    });

    it('returns false when the different class instance given', () => {
      expect.assertions(1);

      const sequence: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>([]);

      expect(sequence.equals(new MockValueObject('mock'))).toBe(false);
    });

    it('returns true even if the order is different', () => {
      expect.assertions(1);

      const value1: MockValueObject<number> = new MockValueObject<number>(1);
      const value2: MockValueObject<number> = new MockValueObject<number>(2);

      const sequence1: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>([value2, value1]);
      const sequence2: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>([value1, value2]);

      expect(sequence1.equals(sequence2)).toBe(false);
    });

    it('returns true if the length is the same and the sequence is the same', () => {
      expect.assertions(1);

      const value1: MockValueObject<number> = new MockValueObject<number>(1);
      const value2: MockValueObject<number> = new MockValueObject<number>(2);

      const sequence1: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>([value1, value2]);
      const sequence2: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>([value1, value2]);

      expect(sequence1.equals(sequence2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns concatenated string', () => {
      expect.assertions(1);

      const sequence: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>([
        new MockValueObject<number>(1),
        new MockValueObject<number>(2),
        new MockValueObject<number>(3)
      ]);

      expect(sequence.toString()).toBe('1, 2, 3');
    });
  });

  describe('toArray', () => {
    it('returns its retaining shallow-copied array', () => {
      expect.assertions(5);

      const values: Array<MockValueObject<number>> = [
        new MockValueObject<number>(1),
        new MockValueObject<number>(2),
        new MockValueObject<number>(3)
      ];

      const sequence: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>(values);
      const array: Array<MockValueObject<number>> = sequence.toArray();

      expect(sequence.size()).toBe(values.length);
      for (let i: number = 0; i < values.length; i++) {
        expect(sequence.get(i)).toBe(array[i]);
      }

      array.push(new MockValueObject<number>(4));

      expect(sequence.size()).not.toBe(array.length);
    });
  });

  describe('values', () => {
    it('returns its retaining values', () => {
      expect.assertions(2);

      const values: Array<MockValueObject<number>> = [
        new MockValueObject<number>(1),
        new MockValueObject<number>(2)
      ];
      const sequence: MockSequence<MockValueObject<number>> = new MockSequence<MockValueObject<number>>(values);

      let i: number = 0;

      for (const value of sequence.values()) {
        expect(value).toBe(values[i]);
        i++;
      }
    });
  });
});
