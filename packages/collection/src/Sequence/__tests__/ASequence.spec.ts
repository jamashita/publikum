import { MockContent, MockNominative, MockValueObject } from '@jamashita/publikum-object';
import { Nullable, Peek, Predicate } from '@jamashita/publikum-type';
import sinon, { SinonSpy } from 'sinon';
import { MockSequence } from '../Mock/MockSequence';

describe('ASequence', () => {
  describe('iterator', () => {
    it('returns Pair<number, MockNominative<number>>', () => {
      expect.assertions(4);

      const sequence: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(2)
      ]);

      let i: number = 0;

      for (const value of sequence) {
        expect(value.getKey()).toBe(i);
        expect(value.getValue().get()).toBe(sequence.get(i)?.get());
        i++;
      }
    });
  });

  describe('get', () => {
    it('returns value at the correct key', () => {
      expect.assertions(4);

      const values: Array<MockNominative<number>> = [
        new MockNominative<number>(1),
        new MockNominative<number>(2),
        new MockNominative<number>(3)
      ];

      const sequence: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>(values);

      expect(sequence.size()).toBe(values.length);
      for (let i: number = 0; i < sequence.size(); i++) {
        expect(sequence.get(i)).toBe(values[i]);
      }
    });

    it('returns null at incorrect keys', () => {
      expect.assertions(2);

      const sequence: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(2),
        new MockNominative<number>(3)
      ]);

      expect(sequence.get(-1)).toBeNull();
      expect(sequence.get(3)).toBeNull();
    });
  });

  describe('contains', () => {
    it('returns false if the value does not exist', () => {
      expect.assertions(1);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);

      const sequence: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([value1, value2]);

      expect(sequence.contains(value3)).toBe(false);
    });

    it('returns true if the value exists', () => {
      expect.assertions(3);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(2);

      const sequence: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([value1, value2]);

      expect(sequence.contains(value1)).toBe(true);
      expect(sequence.contains(value2)).toBe(true);
      expect(sequence.contains(value3)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the values does not exist', () => {
      expect.assertions(2);

      const sequence1: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(2)
      ]);
      const sequence2: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([]);

      expect(sequence1.isEmpty()).toBe(false);
      expect(sequence2.isEmpty()).toBe(true);
    });
  });

  describe('forEach', () => {
    it('calls back as much as the size of set', () => {
      expect.assertions(4);

      const sequence: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(2),
        new MockNominative<number>(3)
      ]);

      expect(sequence.size()).toBe(3);
      sequence.forEach((value: MockNominative<number>, index: number) => {
        expect(sequence.get(index)).toBe(value);
      });
    });

    it('can cancel iteration', () => {
      expect.assertions(5);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();
      const spy5: SinonSpy = sinon.spy();
      const peeks: MockSequence<MockContent<Peek>> = new MockSequence<MockContent<Peek>>([
        new MockContent<Peek>(() => {
          spy1();
        }),
        new MockContent<Peek>(() => {
          spy2();
        }),
        new MockContent<Peek>(() => {
          spy3();
        }),
        new MockContent<Peek>(() => {
          spy4();
        }),
        new MockContent<Peek>(() => {
          spy5();
        })
      ]);

      peeks.forEach((peek: MockContent<Peek>, index: number, cancel: Peek) => {
        peek.get()();

        if (index === 2) {
          cancel();
        }
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
      expect(spy5.called).toBe(false);
    });
  });

  describe('find', () => {
    it('returns the first found value', () => {
      expect.assertions(4);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);
      const value4: MockNominative<number> = new MockNominative<number>(4);

      const sequence: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        value1,
        value2,
        value3,
        value4
      ]);

      const found1: Nullable<MockNominative<number>> = sequence.find((mock: MockNominative<number>) => {
        return mock.get() === 1;
      });
      const found2: Nullable<MockNominative<number>> = sequence.find((mock: MockNominative<number>) => {
        return mock.get() === 2;
      });
      const found3: Nullable<MockNominative<number>> = sequence.find((mock: MockNominative<number>) => {
        return mock.get() % 2 === 0;
      });
      const found4: Nullable<MockNominative<number>> = sequence.find((mock: MockNominative<number>) => {
        return mock.get() > 1000;
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

      const sequence: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        new MockNominative<number>(2),
        new MockNominative<number>(4),
        new MockNominative<number>(6),
        new MockNominative<number>(8)
      ]);

      const every: boolean = sequence.every((mock: MockNominative<number>) => {
        return mock.get() % 2 === 0;
      });

      expect(every).toBe(true);
    });

    it('returns false if at least one of the values is not false', () => {
      expect.assertions(6);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(4);
      const value3: MockNominative<number> = new MockNominative<number>(6);
      const value4: MockNominative<number> = new MockNominative<number>(8);
      const value5: MockNominative<number> = new MockNominative<number>(3);

      const sequence1: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        value1,
        value2,
        value3,
        value4
      ]);
      const sequence2: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        value2,
        value1,
        value3,
        value4
      ]);
      const sequence3: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        value2,
        value3,
        value1,
        value4
      ]);
      const sequence4: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        value2,
        value3,
        value4,
        value1
      ]);
      const sequence5: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        value1,
        value5,
        value3,
        value4
      ]);
      const sequence6: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        value1,
        value2,
        value5,
        value4
      ]);

      const predicate: Predicate<MockNominative<number>> = (mock: MockNominative<number>) => {
        return mock.get() % 2 === 0;
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

      const sequence1: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        new MockNominative<number>(2),
        new MockNominative<number>(4),
        new MockNominative<number>(6),
        new MockNominative<number>(8)
      ]);
      const sequence2: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(4),
        new MockNominative<number>(3),
        new MockNominative<number>(3)
      ]);

      const predicate: Predicate<MockNominative<number>> = (mock: MockNominative<number>) => {
        return mock.get() % 2 === 0;
      };

      const some1: boolean = sequence1.some(predicate);
      const some2: boolean = sequence2.some(predicate);

      expect(some1).toBe(true);
      expect(some2).toBe(true);
    });

    it('returns false if none of the values are true', () => {
      expect.assertions(1);

      const value1: MockNominative<number> = new MockNominative<number>(2);
      const value2: MockNominative<number> = new MockNominative<number>(4);
      const value3: MockNominative<number> = new MockNominative<number>(6);
      const value4: MockNominative<number> = new MockNominative<number>(8);

      const sequence: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        value1,
        value2,
        value3,
        value4
      ]);

      const predicate: Predicate<MockNominative<number>> = (mock: MockNominative<number>) => {
        return mock.get() % 2 === 1;
      };

      const some: boolean = sequence.some(predicate);

      expect(some).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true when the same instance given', () => {
      expect.assertions(1);

      const value: MockNominative<number> = new MockNominative<number>(1);

      const sequence: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([value]);

      expect(sequence.equals(sequence)).toBe(true);
    });

    it('returns false if the size is different', () => {
      expect.assertions(1);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);

      const sequence1: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([value1]);
      const sequence2: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([value1, value2]);

      expect(sequence1.equals(sequence2)).toBe(false);
    });

    it('returns false when the different class instance given', () => {
      expect.assertions(1);

      const sequence: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([]);

      expect(sequence.equals(new MockValueObject('mock'))).toBe(false);
    });

    it('returns true even if the order is different', () => {
      expect.assertions(1);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);

      const sequence1: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([value2, value1]);
      const sequence2: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([value1, value2]);

      expect(sequence1.equals(sequence2)).toBe(false);
    });

    it('returns true if the length is the same and the sequence is the same', () => {
      expect.assertions(1);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);

      const sequence1: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([value1, value2]);
      const sequence2: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([value1, value2]);

      expect(sequence1.equals(sequence2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns concatenated string', () => {
      expect.assertions(1);

      const sequence: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>([
        new MockNominative<number>(1),
        new MockNominative<number>(2),
        new MockNominative<number>(3)
      ]);

      expect(sequence.toString()).toBe('1, 2, 3');
    });
  });

  describe('toArray', () => {
    it('returns its retaining shallow-copied array', () => {
      expect.assertions(5);

      const values: Array<MockNominative<number>> = [
        new MockNominative<number>(1),
        new MockNominative<number>(2),
        new MockNominative<number>(3)
      ];

      const sequence: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>(values);
      const array: Array<MockNominative<number>> = sequence.toArray();

      expect(sequence.size()).toBe(values.length);
      for (let i: number = 0; i < values.length; i++) {
        expect(sequence.get(i)).toBe(array[i]);
      }

      array.push(new MockNominative<number>(4));

      expect(sequence.size()).not.toBe(array.length);
    });
  });

  describe('values', () => {
    it('returns its retaining values', () => {
      expect.assertions(2);

      const values: Array<MockNominative<number>> = [
        new MockNominative<number>(1),
        new MockNominative<number>(2)
      ];
      const sequence: MockSequence<MockNominative<number>> = new MockSequence<MockNominative<number>>(values);

      let i: number = 0;

      for (const value of sequence.values()) {
        expect(value).toBe(values[i]);
        i++;
      }
    });
  });
});
