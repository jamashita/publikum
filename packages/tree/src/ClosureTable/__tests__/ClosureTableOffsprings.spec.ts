import { Address, ImmutableAddress, MockAddress } from '@jamashita/publikum-collection';
import { Nominative } from '@jamashita/publikum-interface';
import { MockValueObject } from '@jamashita/publikum-object';
import sinon, { SinonSpy } from 'sinon';
import { ClosureTableOffsprings } from '../ClosureTableOffsprings';

describe('ClosureTableOffsprings', () => {
  describe('of', () => {
    it('returns ClosureTableOffsprings.empty() when 0-size Address given', () => {
      expect.assertions(1);

      expect(ClosureTableOffsprings.of<Nominative>(new MockAddress<Nominative>(new Set<Nominative>()))).toBe(ClosureTableOffsprings.empty<Nominative>());
    });
  });

  describe('ofArray', () => {
    it('returns ClosureTableOffsprings.empty() when 0-length array given', () => {
      expect.assertions(1);

      expect(ClosureTableOffsprings.ofArray<Nominative>([])).toBe(ClosureTableOffsprings.empty<Nominative>());
    });
  });

  describe('empty', () => {
    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(ClosureTableOffsprings.empty<Nominative>()).toBe(ClosureTableOffsprings.empty<Nominative>());
    });

    it('\'s size is 0', () => {
      expect.assertions(1);

      expect(ClosureTableOffsprings.empty<Nominative>().size()).toBe(0);
    });
  });

  describe('equals', () => {
    it('returns true when the same instance given', () => {
      expect.assertions(1);

      const offsprings: ClosureTableOffsprings<MockValueObject<string>> = ClosureTableOffsprings.ofArray<MockValueObject<string>>([new MockValueObject<string>('mock 1'), new MockValueObject<string>('mock 2')]);

      expect(offsprings.equals(offsprings)).toBe(true);
    });

    it('returns false when the different class instance given', () => {
      expect.assertions(1);

      const offsprings: ClosureTableOffsprings<MockValueObject<string>> = ClosureTableOffsprings.ofArray<MockValueObject<string>>([new MockValueObject<string>('mock 1'), new MockValueObject<string>('mock 2')]);

      expect(offsprings.equals(new MockValueObject<string>('mock 1'))).toBe(false);
    });

    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();
      const address: Address<MockValueObject<string>> = new MockAddress<MockValueObject<string>>(new Set<MockValueObject<string>>());

      address.equals = spy;

      const offsprings: ClosureTableOffsprings<MockValueObject<string>> = ClosureTableOffsprings.empty<MockValueObject<string>>();
      // @ts-expect-error
      offsprings.offsprings = address;

      offsprings.equals(ClosureTableOffsprings.of<MockValueObject<string>>(ImmutableAddress.ofSet<MockValueObject<string>>(new Set<MockValueObject<string>>([new MockValueObject<string>('mock 1')]))));

      expect(spy.called).toBe(true);
    });
  });

  describe('toString', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();
      const address: MockAddress<Nominative> = new MockAddress<Nominative>(new Set<Nominative>());

      address.toString = spy;

      const offsprings: ClosureTableOffsprings<MockValueObject<string>> = ClosureTableOffsprings.empty<MockValueObject<string>>();
      // @ts-expect-error
      offsprings.offsprings = address;

      offsprings.toString();

      expect(spy.called).toBe(true);
    });
  });

  describe('size', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();
      const address: MockAddress<Nominative> = new MockAddress<Nominative>(new Set<Nominative>());

      address.size = spy;

      const offsprings: ClosureTableOffsprings<MockValueObject<string>> = ClosureTableOffsprings.empty<MockValueObject<string>>();
      // @ts-expect-error
      offsprings.offsprings = address;

      offsprings.size();

      expect(spy.called).toBe(true);
    });
  });

  describe('value', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();
      const address: MockAddress<Nominative> = new MockAddress<Nominative>(new Set<Nominative>());

      address.values = spy;

      const offsprings: ClosureTableOffsprings<MockValueObject<string>> = ClosureTableOffsprings.empty<MockValueObject<string>>();
      // @ts-expect-error
      offsprings.offsprings = address;

      offsprings.values();

      expect(spy.called).toBe(true);
    });
  });

  describe('iterator', () => {
    it('returns Pair<void, K>', () => {
      expect.assertions(3);

      const array: Array<MockValueObject<string>> = [
        new MockValueObject<string>('mock 1'),
        new MockValueObject<string>('mock 2'),
        new MockValueObject<string>('mock 3')
      ];

      const offsprings: ClosureTableOffsprings<MockValueObject<string>> = ClosureTableOffsprings.ofArray<MockValueObject<string>>(array);
      let i: number = 0;

      for (const pair of offsprings) {
        expect(pair.getValue()).toBe(array[i]);
        i++;
      }
    });
  });

  describe('contains', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();
      const address: MockAddress<Nominative> = new MockAddress<Nominative>(new Set<Nominative>());

      address.contains = spy;

      const offsprings: ClosureTableOffsprings<MockValueObject<string>> = ClosureTableOffsprings.empty<MockValueObject<string>>();
      // @ts-expect-error
      offsprings.offsprings = address;

      offsprings.contains(new MockValueObject<string>('mock'));

      expect(spy.called).toBe(true);
    });
  });

  describe('every', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();
      const address: MockAddress<Nominative> = new MockAddress<Nominative>(new Set<Nominative>());

      address.every = spy;

      const offsprings: ClosureTableOffsprings<MockValueObject<string>> = ClosureTableOffsprings.empty<MockValueObject<string>>();
      // @ts-expect-error
      offsprings.offsprings = address;

      offsprings.every(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('forEach', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();
      const address: MockAddress<Nominative> = new MockAddress<Nominative>(new Set<Nominative>());

      address.forEach = spy;

      const offsprings: ClosureTableOffsprings<MockValueObject<string>> = ClosureTableOffsprings.empty<MockValueObject<string>>();
      // @ts-expect-error
      offsprings.offsprings = address;

      offsprings.forEach(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('get', () => {
    it('returns null', () => {
      expect.assertions(2);

      const offsprings1: ClosureTableOffsprings<MockValueObject<string>> = ClosureTableOffsprings.empty<MockValueObject<string>>();
      const offsprings2: ClosureTableOffsprings<MockValueObject<string>> = ClosureTableOffsprings.ofArray<MockValueObject<string>>([new MockValueObject<string>('mock')]);

      expect(offsprings1.get()).toBeNull();
      expect(offsprings2.get()).toBeNull();
    });
  });

  describe('isEmpty', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();
      const address: MockAddress<Nominative> = new MockAddress<Nominative>(new Set<Nominative>());

      address.isEmpty = spy;

      const offsprings: ClosureTableOffsprings<MockValueObject<string>> = ClosureTableOffsprings.empty<MockValueObject<string>>();
      // @ts-expect-error
      offsprings.offsprings = address;

      offsprings.isEmpty();

      expect(spy.called).toBe(true);
    });
  });

  describe('some', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();
      const address: MockAddress<Nominative> = new MockAddress<Nominative>(new Set<Nominative>());

      address.some = spy;

      const offsprings: ClosureTableOffsprings<MockValueObject<string>> = ClosureTableOffsprings.empty<MockValueObject<string>>();
      // @ts-expect-error
      offsprings.offsprings = address;

      offsprings.some(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('isLeaf', () => {
    it('returns true when the size is 1', () => {
      expect.assertions(1);

      const offsprings: ClosureTableOffsprings<MockValueObject<string>> = ClosureTableOffsprings.ofArray<MockValueObject<string>>([new MockValueObject<string>('mock 1')]);

      expect(offsprings.isLeaf()).toBe(true);
    });

    it('returns false when the size is not 1', () => {
      expect.assertions(2);

      const offsprings01: ClosureTableOffsprings<MockValueObject<string>> = ClosureTableOffsprings.ofArray<MockValueObject<string>>([]);
      const offsprings02: ClosureTableOffsprings<MockValueObject<string>> = ClosureTableOffsprings.ofArray<MockValueObject<string>>([new MockValueObject<string>('mock 1'), new MockValueObject<string>('mock 2')]);

      expect(offsprings01.isLeaf()).toBe(false);
      expect(offsprings02.isLeaf()).toBe(false);
    });
  });

  describe('compare', () => {
    it('returns the subtraction of sizes', () => {
      expect.assertions(3);

      const offsprings01: ClosureTableOffsprings<MockValueObject<string>> = ClosureTableOffsprings.ofArray<MockValueObject<string>>([]);
      const offsprings02: ClosureTableOffsprings<MockValueObject<string>> = ClosureTableOffsprings.ofArray<MockValueObject<string>>([new MockValueObject<string>('mock 1'), new MockValueObject<string>('mock 2')]);

      expect(offsprings01.compare(offsprings01)).toBe(0);
      expect(offsprings01.compare(offsprings02)).toBe(-2);
      expect(offsprings02.compare(offsprings01)).toBe(2);
    });
  });

  describe('values', () => {
    it('returns Iterator<K>', () => {
      expect.assertions(2);

      const array: Array<MockValueObject<string>> = [new MockValueObject<string>('mock 1'), new MockValueObject<string>('mock 2')];
      const offsprings: ClosureTableOffsprings<MockValueObject<string>> = ClosureTableOffsprings.ofArray<MockValueObject<string>>(array);
      let i: number = 0;

      for (const p of offsprings.values()) {
        expect(p).toBe(array[i]);
        i++;
      }
    });
  });

  describe('map', () => {
    it('delegates its inner collection instance', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();
      const address: MockAddress<Nominative> = new MockAddress<Nominative>(new Set<Nominative>());

      address.map = spy;

      const offsprings: ClosureTableOffsprings<MockValueObject<string>> = ClosureTableOffsprings.empty<MockValueObject<string>>();
      // @ts-expect-error
      offsprings.offsprings = address;

      offsprings.map((mock: MockValueObject<string>) => {
        return mock;
      });

      expect(spy.called).toBe(true);
    });
  });
});
