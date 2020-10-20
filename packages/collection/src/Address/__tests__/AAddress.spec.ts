import { MockContent, MockNominative, MockValueObject } from '@jamashita/publikum-object';
import { Nullable, Peek, Predicate } from '@jamashita/publikum-type';
import sinon, { SinonSpy } from 'sinon';
import { MockAddress } from '../Mock/MockAddress';

describe('AAddress', () => {
  describe('iterator', () => {
    it('returns Pair<void, MockNominative<number>>', () => {
      expect.assertions(2);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const values: Array<MockNominative<number>> = [value1, value2];

      const address: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([value1, value2])
      );

      let i: number = 0;

      for (const value of address) {
        expect(value.getValue()).toBe(values[i]);
        i++;
      }
    });
  });

  describe('get', () => {
    it('always returns null', () => {
      expect.assertions(4);

      const value1: MockNominative<number> = new MockNominative<number>(1);

      const address1: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>()
      );
      const address2: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([value1])
      );

      expect(address1.size()).toBe(0);
      expect(address2.get()).toBeNull();
      expect(address2.size()).toBe(1);
      expect(address2.get()).toBeNull();
    });
  });

  describe('contains', () => {
    it('returns false if the value does not exist', () => {
      expect.assertions(1);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);

      const address: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([value1, value2])
      );

      expect(address.contains(value3)).toBe(false);
    });

    it('returns true if the value exists', () => {
      expect.assertions(3);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(2);

      const address: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([value1, value2])
      );

      expect(address.contains(value1)).toBe(true);
      expect(address.contains(value2)).toBe(true);
      expect(address.contains(value3)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the values does not exist', () => {
      expect.assertions(2);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);

      const address1: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([value1, value2])
      );
      const address2: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>()
      );

      expect(address1.isEmpty()).toBe(false);
      expect(address2.isEmpty()).toBe(true);
    });
  });

  describe('forEach', () => {
    it('calls back as much as the size of set', () => {
      expect.assertions(4);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);
      const values: Array<MockNominative<number>> = [value1, value2, value3];

      const address: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>(values)
      );
      let i: number = 0;

      expect(address.size()).toBe(values.length);
      address.forEach((value: MockNominative<number>) => {
        expect(value).toBe(values[i]);
        i++;
      });
    });

    it('can cancel iteration', () => {
      expect.assertions(5);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();
      const spy5: SinonSpy = sinon.spy();
      const peeks: MockAddress<MockContent<Peek>> = new MockAddress<MockContent<Peek>>(
        new Set<MockContent<Peek>>([
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
        ])
      );

      let i: number = 0;

      peeks.forEach((peek: MockContent<Peek>, _: void, cancel: Peek) => {
        peek.get()();

        if (i === 2) {
          cancel();
          return;
        }

        i++;
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

      const address: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([value1, value2, value3, value4])
      );

      const found1: Nullable<MockNominative<number>> = address.find((mock: MockNominative<number>) => {
        return mock.get() === 1;
      });
      const found2: Nullable<MockNominative<number>> = address.find((mock: MockNominative<number>) => {
        return mock.get() === 2;
      });
      const found3: Nullable<MockNominative<number>> = address.find((mock: MockNominative<number>) => {
        return mock.get() % 2 === 0;
      });
      const found4: Nullable<MockNominative<number>> = address.find((mock: MockNominative<number>) => {
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

      const value1: MockNominative<number> = new MockNominative<number>(2);
      const value2: MockNominative<number> = new MockNominative<number>(4);
      const value3: MockNominative<number> = new MockNominative<number>(6);
      const value4: MockNominative<number> = new MockNominative<number>(8);

      const address: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([value1, value2, value3, value4])
      );

      const every: boolean = address.every((value: MockNominative<number>) => {
        return value.get() % 2 === 0;
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

      const address1: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([value1, value2, value3, value4])
      );
      const address2: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([value2, value1, value3, value4])
      );
      const address3: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([value2, value3, value1, value4])
      );
      const address4: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([value2, value3, value4, value1])
      );
      const address5: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([value1, value5, value3, value4])
      );
      const address6: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([value1, value2, value5, value4])
      );

      const predicate: Predicate<MockNominative<number>> = (mock: MockNominative<number>) => {
        return mock.get() % 2 === 0;
      };

      const every1: boolean = address1.every(predicate);
      const every2: boolean = address2.every(predicate);
      const every3: boolean = address3.every(predicate);
      const every4: boolean = address4.every(predicate);
      const every5: boolean = address5.every(predicate);
      const every6: boolean = address6.every(predicate);

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

      const value1: MockNominative<number> = new MockNominative<number>(2);
      const value2: MockNominative<number> = new MockNominative<number>(4);
      const value3: MockNominative<number> = new MockNominative<number>(6);
      const value4: MockNominative<number> = new MockNominative<number>(8);
      const value5: MockNominative<number> = new MockNominative<number>(3);
      const value6: MockNominative<number> = new MockNominative<number>(5);
      const value7: MockNominative<number> = new MockNominative<number>(7);

      const address1: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([value1, value2, value3, value4])
      );
      const address2: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([value1, value5, value6, value7])
      );

      const predicate: Predicate<MockNominative<number>> = (mock: MockNominative<number>) => {
        return mock.get() % 2 === 0;
      };

      const some1: boolean = address1.some(predicate);
      const some2: boolean = address2.some(predicate);

      expect(some1).toBe(true);
      expect(some2).toBe(true);
    });

    it('returns false if none of the values are true', () => {
      expect.assertions(1);

      const value1: MockNominative<number> = new MockNominative<number>(4);
      const value2: MockNominative<number> = new MockNominative<number>(6);
      const value3: MockNominative<number> = new MockNominative<number>(8);
      const value4: MockNominative<number> = new MockNominative<number>(10);

      const address: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([value1, value2, value3, value4])
      );

      const predicate: Predicate<MockNominative<number>> = (mock: MockNominative<number>) => {
        return mock.get() % 2 === 1;
      };

      const some: boolean = address.some(predicate);

      expect(some).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true when the same instance given', () => {
      expect.assertions(1);

      const value: MockNominative<number> = new MockNominative<number>(1);

      const address: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([value])
      );

      expect(address.equals(address)).toBe(true);
    });

    it('returns false if the size is different', () => {
      expect.assertions(1);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);

      const address1: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([value1])
      );
      const address2: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([value1, value2])
      );

      expect(address1.equals(address2)).toBe(false);
    });

    it('returns false when the different class instance given', () => {
      expect.assertions(1);

      const address: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>()
      );

      expect(address.equals(new MockValueObject('mock'))).toBe(false);
    });

    it('returns true even if the order is different', () => {
      expect.assertions(1);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);

      const address1: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([value2, value1])
      );
      const address2: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([value1, value2])
      );

      expect(address1.equals(address2)).toBe(true);
    });

    it('returns true if the size is the same and the order is the quite same', () => {
      expect.assertions(1);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);

      const address1: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([value1, value2])
      );
      const address2: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([value1, value2])
      );

      expect(address1.equals(address2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns concatenated string', () => {
      expect.assertions(1);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);

      const address: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([value1, value2, value3])
      );

      expect(address.toString()).toBe('1, 2, 3');
    });
  });

  describe('toSet', () => {
    it('returns its retaining shallow-copied set', () => {
      expect.assertions(5);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);
      const values: Array<MockNominative<number>> = [value1, value2, value3];

      const address: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set(values)
      );
      const set: Set<MockNominative<number>> = address.toSet();

      expect(address.size()).toBe(set.size);
      for (let i: number = 0; i < set.size; i++) {
        expect(set.has(values[i])).toBe(true);
      }
      set.add(new MockNominative<number>(4));

      expect(address.size()).not.toBe(set.size);
    });
  });

  describe('values', () => {
    it('returns its retaining values', () => {
      expect.assertions(2);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const values: Array<MockNominative<number>> = [value1, value2];

      const address: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([value1, value2])
      );

      let i: number = 0;

      for (const value of address.values()) {
        expect(value.get()).toBe(values[i].get());
        i++;
      }
    });
  });
});
