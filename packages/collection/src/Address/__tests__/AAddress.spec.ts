import { MockContent, MockNominative, MockValueObject } from '@jamashita/publikum-object';
import { Nullable, Peek, Predicate } from '@jamashita/publikum-type';
import sinon, { SinonSpy } from 'sinon';
import { MockAddress } from '../Mock/MockAddress';

describe('AAddress', () => {
  describe('iterator', () => {
    it('returns Pair<void, MockNominative<number>>', () => {
      expect.assertions(2);

      const address1: MockNominative<number> = new MockNominative<number>(1);
      const address2: MockNominative<number> = new MockNominative<number>(2);
      const values: Array<MockNominative<number>> = [address1, address2];

      const addresses: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([address1, address2])
      );

      let i: number = 0;

      for (const address of addresses) {
        expect(address.getValue()).toBe(values[i]);
        i++;
      }
    });
  });

  describe('get', () => {
    it('always returns null', () => {
      expect.assertions(4);

      const address1: MockNominative<number> = new MockNominative<number>(1);

      const addresses1: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(new Set<MockNominative<number>>());
      const addresses2: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(new Set<MockNominative<number>>([address1]));

      expect(addresses1.size()).toBe(0);
      expect(addresses2.get()).toBeNull();
      expect(addresses2.size()).toBe(1);
      expect(addresses2.get()).toBeNull();
    });
  });

  describe('contains', () => {
    it('returns false if the value does not exist', () => {
      expect.assertions(1);

      const address1: MockNominative<number> = new MockNominative<number>(1);
      const address2: MockNominative<number> = new MockNominative<number>(2);
      const address3: MockNominative<number> = new MockNominative<number>(3);

      const addresses: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([address1, address2])
      );

      expect(addresses.contains(address3)).toBe(false);
    });

    it('returns true if the value exists', () => {
      expect.assertions(3);

      const address1: MockNominative<number> = new MockNominative<number>(1);
      const address2: MockNominative<number> = new MockNominative<number>(2);
      const address3: MockNominative<number> = new MockNominative<number>(2);

      const addresses: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([address1, address2])
      );

      expect(addresses.contains(address1)).toBe(true);
      expect(addresses.contains(address2)).toBe(true);
      expect(addresses.contains(address3)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the values does not exist', () => {
      expect.assertions(2);

      const address1: MockNominative<number> = new MockNominative<number>(1);
      const address2: MockNominative<number> = new MockNominative<number>(2);

      const addresses1: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([address1, address2])
      );
      const addresses2: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(new Set());

      expect(addresses1.isEmpty()).toBe(false);
      expect(addresses2.isEmpty()).toBe(true);
    });
  });

  describe('forEach', () => {
    it('calls back as much as the length of the size of set', () => {
      expect.assertions(4);

      const address1: MockNominative<number> = new MockNominative<number>(1);
      const address2: MockNominative<number> = new MockNominative<number>(2);
      const address3: MockNominative<number> = new MockNominative<number>(3);
      const values: Array<MockNominative<number>> = [address1, address2, address3];

      const addresses: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(new Set<MockNominative<number>>(values));
      let i: number = 0;

      expect(addresses.size()).toBe(values.length);
      addresses.forEach((address: MockNominative<number>) => {
        expect(address).toBe(values[i]);
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

      const address1: MockNominative<number> = new MockNominative<number>(1);
      const address2: MockNominative<number> = new MockNominative<number>(2);
      const address3: MockNominative<number> = new MockNominative<number>(3);
      const address4: MockNominative<number> = new MockNominative<number>(4);

      const addresses: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([address1, address2, address3, address4])
      );

      const found1: Nullable<MockNominative<number>> = addresses.find((mock: MockNominative<number>) => {
        return mock.get() === 1;
      });
      const found2: Nullable<MockNominative<number>> = addresses.find((mock: MockNominative<number>) => {
        return mock.get() === 2;
      });
      const found3: Nullable<MockNominative<number>> = addresses.find((mock: MockNominative<number>) => {
        return mock.get() % 2 === 0;
      });
      const found4: Nullable<MockNominative<number>> = addresses.find((mock: MockNominative<number>) => {
        return mock.get() > 1000;
      });

      expect(found1).toBe(address1);
      expect(found2).toBe(address2);
      expect(found3).toBe(address2);
      expect(found4).toBeNull();
    });
  });

  describe('every', () => {
    it('returns true if all the values are the same', () => {
      expect.assertions(1);

      const address1: MockNominative<number> = new MockNominative<number>(2);
      const address2: MockNominative<number> = new MockNominative<number>(4);
      const address3: MockNominative<number> = new MockNominative<number>(6);
      const address4: MockNominative<number> = new MockNominative<number>(8);

      const addresses: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([address1, address2, address3, address4])
      );

      const predicate: Predicate<MockNominative<number>> = (mock: MockNominative<number>) => {
        return mock.get() % 2 === 0;
      };

      const every: boolean = addresses.every(predicate);

      expect(every).toBe(true);
    });

    it('returns false if at least one of the values is not false', () => {
      expect.assertions(6);

      const address1: MockNominative<number> = new MockNominative<number>(1);
      const address2: MockNominative<number> = new MockNominative<number>(4);
      const address3: MockNominative<number> = new MockNominative<number>(6);
      const address4: MockNominative<number> = new MockNominative<number>(8);
      const address5: MockNominative<number> = new MockNominative<number>(3);

      const addresses1: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([address1, address2, address3, address4])
      );
      const addresses2: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([address2, address1, address3, address4])
      );
      const addresses3: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([address2, address3, address1, address4])
      );
      const addresses4: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([address2, address3, address4, address1])
      );
      const addresses5: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([address1, address5, address3, address4])
      );
      const addresses6: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([address1, address2, address5, address4])
      );

      const predicate: Predicate<MockNominative<number>> = (mock: MockNominative<number>) => {
        return mock.get() % 2 === 0;
      };

      const every1: boolean = addresses1.every(predicate);
      const every2: boolean = addresses2.every(predicate);
      const every3: boolean = addresses3.every(predicate);
      const every4: boolean = addresses4.every(predicate);
      const every5: boolean = addresses5.every(predicate);
      const every6: boolean = addresses6.every(predicate);

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

      const address1: MockNominative<number> = new MockNominative<number>(2);
      const address2: MockNominative<number> = new MockNominative<number>(4);
      const address3: MockNominative<number> = new MockNominative<number>(6);
      const address4: MockNominative<number> = new MockNominative<number>(8);
      const address5: MockNominative<number> = new MockNominative<number>(3);
      const address6: MockNominative<number> = new MockNominative<number>(5);
      const address7: MockNominative<number> = new MockNominative<number>(7);

      const addresses1: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([address1, address2, address3, address4])
      );
      const addresses2: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([address1, address5, address6, address7])
      );

      const predicate: Predicate<MockNominative<number>> = (mock: MockNominative<number>) => {
        return mock.get() % 2 === 0;
      };

      const some1: boolean = addresses1.some(predicate);
      const some2: boolean = addresses2.some(predicate);

      expect(some1).toBe(true);
      expect(some2).toBe(true);
    });

    it('returns false if none of the values are true', () => {
      expect.assertions(1);

      const address1: MockNominative<number> = new MockNominative<number>(4);
      const address2: MockNominative<number> = new MockNominative<number>(6);
      const address3: MockNominative<number> = new MockNominative<number>(8);
      const address4: MockNominative<number> = new MockNominative<number>(10);

      const addresses1: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([address1, address2, address3, address4])
      );

      const predicate: Predicate<MockNominative<number>> = (mock: MockNominative<number>) => {
        return mock.get() % 2 === 1;
      };

      const some1: boolean = addresses1.some(predicate);

      expect(some1).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns false if the length is different', () => {
      expect.assertions(2);

      const address1: MockNominative<number> = new MockNominative<number>(1);
      const address2: MockNominative<number> = new MockNominative<number>(2);

      const addresses1: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(new Set<MockNominative<number>>([address1]));
      const addresses2: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([address1, address2])
      );

      expect(addresses1.equals(addresses1)).toBe(true);
      expect(addresses1.equals(addresses2)).toBe(false);
    });

    it('returns false when the different class instance given', () => {
      expect.assertions(1);

      const addresses: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(new Set<MockNominative<number>>());

      expect(addresses.equals(new MockValueObject('mock'))).toBe(false);
    });

    it('returns true even if the order is different', () => {
      expect.assertions(2);

      const address1: MockNominative<number> = new MockNominative<number>(1);
      const address2: MockNominative<number> = new MockNominative<number>(2);

      const addresses1: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([address2, address1])
      );
      const addresses2: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([address1, address2])
      );

      expect(addresses1.equals(addresses1)).toBe(true);
      expect(addresses1.equals(addresses2)).toBe(true);
    });

    it('returns true if the length is the same and the order is the quite same', () => {
      expect.assertions(2);

      const address1: MockNominative<number> = new MockNominative<number>(1);
      const address2: MockNominative<number> = new MockNominative<number>(2);

      const addresses1: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([address1, address2])
      );
      const addresses2: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([address1, address2])
      );

      expect(addresses1.equals(addresses1)).toBe(true);
      expect(addresses1.equals(addresses2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns concatnated string', () => {
      expect.assertions(1);

      const address1: MockNominative<number> = new MockNominative<number>(1);
      const address2: MockNominative<number> = new MockNominative<number>(2);
      const address3: MockNominative<number> = new MockNominative<number>(3);

      const addresses: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([address1, address2, address3])
      );

      expect(addresses.toString()).toBe('1, 2, 3');
    });
  });

  describe('toSet', () => {
    it('returns its retaining shallow-copied set', () => {
      expect.assertions(5);

      const address1: MockNominative<number> = new MockNominative<number>(1);
      const address2: MockNominative<number> = new MockNominative<number>(2);
      const address3: MockNominative<number> = new MockNominative<number>(3);
      const values: Array<MockNominative<number>> = [address1, address2, address3];

      const addresses: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(new Set(values));
      const set: Set<MockNominative<number>> = addresses.toSet();

      expect(addresses.size()).toBe(set.size);
      for (let i: number = 0; i < set.size; i++) {
        expect(set.has(values[i])).toBe(true);
      }
      set.add(new MockNominative<number>(4));

      expect(addresses.size()).not.toBe(set.size);
    });
  });

  describe('values', () => {
    it('returns its retaining values', () => {
      expect.assertions(2);

      const address1: MockNominative<number> = new MockNominative<number>(1);
      const address2: MockNominative<number> = new MockNominative<number>(2);
      const values: Array<MockNominative<number>> = [address1, address2];

      const addresses: MockAddress<MockNominative<number>> = new MockAddress<MockNominative<number>>(
        new Set<MockNominative<number>>([address1, address2])
      );

      let i: number = 0;

      for (const address of addresses.values()) {
        expect(address.get()).toBe(values[i].get());
        i++;
      }
    });
  });
});
