import { MockNominative } from '@jamashita/publikum-object';
import { MutableAddress } from '../MutableAddress';

describe('MutableAddress', () => {
  describe('of', () => {
    it('returns copied collection, does not use the same one', () => {
      expect.assertions(4);

      const address: MutableAddress<MockNominative<number>> = MutableAddress.ofSet<MockNominative<number>>(
        new Set<MockNominative<number>>([
          new MockNominative<number>(1),
          new MockNominative<number>(2)
        ])
      );
      const copied: MutableAddress<MockNominative<number>> = MutableAddress.of<MockNominative<number>>(address);

      expect(address.size()).toBe(copied.size());
      address.forEach((n: MockNominative<number>) => {
        expect(copied.contains(n)).toBe(true);
      });

      address.add(new MockNominative<number>(3));

      expect(address.isEmpty()).not.toBe(copied.size());
    });
  });

  describe('ofSet', () => {
    it('returns MutableAddress.empty() when set size is 0', () => {
      expect.assertions(1);

      const address: MutableAddress<MockNominative<number>> = MutableAddress.ofSet<MockNominative<number>>(new Set<MockNominative<number>>());

      expect(address.isEmpty()).toBe(true);
    });

    it('returns instance', () => {
      expect.assertions(2);

      const address1: MutableAddress<MockNominative<number>> = MutableAddress.ofSet<MockNominative<number>>(
        new Set<MockNominative<number>>([new MockNominative<number>(1), new MockNominative<number>(3)])
      );
      const address2: MutableAddress<MockNominative<number>> = MutableAddress.ofSet<MockNominative<number>>(
        new Set<MockNominative<number>>([
          new MockNominative<number>(2),
          new MockNominative<number>(4),
          new MockNominative<number>(5)
        ])
      );

      expect(address1.size()).toBe(2);
      expect(address2.size()).toBe(3);
    });
  });

  describe('empty', () => {
    it('does not return singleton instance', () => {
      expect.assertions(1);

      expect(MutableAddress.empty<MockNominative<number>>()).not.toBe(MutableAddress.empty<MockNominative<number>>());
    });

    it('always returns 0-size set', () => {
      expect.assertions(1);

      const address: MutableAddress<MockNominative<number>> = MutableAddress.empty<MockNominative<number>>();

      expect(address.isEmpty()).toBe(true);
    });
  });

  describe('add', () => {
    it('can extend mutably', () => {
      expect.assertions(6);

      const address1: MockNominative<number> = new MockNominative<number>(1);
      const address2: MockNominative<number> = new MockNominative<number>(2);
      const address3: MockNominative<number> = new MockNominative<number>(3);

      const addresses1: MutableAddress<MockNominative<number>> = MutableAddress.empty<MockNominative<number>>();

      expect(addresses1.size()).toBe(0);

      const addresses2: MutableAddress<MockNominative<number>> = addresses1.add(address1);

      expect(addresses1).toBe(addresses2);
      expect(addresses1.size()).toBe(1);

      const addresses3: MutableAddress<MockNominative<number>> = addresses2.add(address2).add(address3);

      expect(addresses1).toBe(addresses2);
      expect(addresses2).toBe(addresses3);
      expect(addresses1.size()).toBe(3);
    });

    it('does nothing when the arguments are already contained', () => {
      expect.assertions(2);

      const address1: MockNominative<number> = new MockNominative<number>(1);
      const address2: MockNominative<number> = new MockNominative<number>(2);

      const addresses1: MutableAddress<MockNominative<number>> = MutableAddress.ofSet<MockNominative<number>>(
        new Set<MockNominative<number>>([address1, address2])
      );
      const addresses2: MutableAddress<MockNominative<number>> = addresses1.add(address1);

      expect(addresses1).toBe(addresses2);
      expect(addresses1.size()).toBe(2);
    });

    it('does nothing when the other same value object are already contained', () => {
      expect.assertions(2);

      const address1: MockNominative<number> = new MockNominative<number>(1);
      const address2: MockNominative<number> = new MockNominative<number>(2);
      const address3: MockNominative<number> = new MockNominative<number>(1);

      const addresses1: MutableAddress<MockNominative<number>> = MutableAddress.ofSet<MockNominative<number>>(
        new Set<MockNominative<number>>([address1, address2])
      );
      const addresses2: MutableAddress<MockNominative<number>> = addresses1.add(address3);

      expect(addresses1).toBe(addresses2);
      expect(addresses1.size()).toBe(2);
    });
  });

  describe('remove', () => {
    it('cancel remove retaining value if it contains', () => {
      expect.assertions(2);

      const address1: MockNominative<number> = new MockNominative<number>(1);
      const address2: MockNominative<number> = new MockNominative<number>(2);

      const addresses1: MutableAddress<MockNominative<number>> = MutableAddress.ofSet<MockNominative<number>>(
        new Set<MockNominative<number>>([address1, address2])
      );
      const addresses2: MutableAddress<MockNominative<number>> = addresses1.remove(address1);

      expect(addresses1).toBe(addresses2);
      expect(addresses2.size()).toBe(1);
    });

    it('does nothing when there is no such value', () => {
      expect.assertions(2);

      const address1: MockNominative<number> = new MockNominative<number>(1);
      const address2: MockNominative<number> = new MockNominative<number>(2);

      const addresses: MutableAddress<MockNominative<number>> = MutableAddress.ofSet<MockNominative<number>>(
        new Set<MockNominative<number>>([address1])
      );
      const beforeLength: number = addresses.size();

      expect(addresses.remove(address2)).toBe(addresses);
      expect(addresses.size()).toBe(beforeLength);
    });

    it('returns the removed Address', () => {
      expect.assertions(2);

      const address1: MockNominative<number> = new MockNominative<number>(1);
      const address2: MockNominative<number> = new MockNominative<number>(2);
      const address3: MockNominative<number> = new MockNominative<number>(2);

      const addresses1: MutableAddress<MockNominative<number>> = MutableAddress.ofSet<MockNominative<number>>(
        new Set<MockNominative<number>>([address1, address2])
      );
      const addresses2: MutableAddress<MockNominative<number>> = addresses1.remove(address3);

      expect(addresses1).toBe(addresses2);
      expect(addresses1.size()).toBe(1);
    });
  });

  describe('isEmpty', () => {
    it('returns true if the value size is 0', () => {
      expect.assertions(2);

      const address1: MockNominative<number> = new MockNominative<number>(1);
      const address2: MockNominative<number> = new MockNominative<number>(2);

      const addresses1: MutableAddress<MockNominative<number>> = MutableAddress.ofSet<MockNominative<number>>(
        new Set<MockNominative<number>>([address1, address2])
      );
      const addresses2: MutableAddress<MockNominative<number>> = MutableAddress.ofSet<MockNominative<number>>(
        new Set<MockNominative<number>>([])
      );

      expect(addresses1.isEmpty()).toBe(false);
      expect(addresses2.isEmpty()).toBe(true);
    });
  });

  describe('map', () => {
    it('execute the mapper function and returns mapped Address immutably', () => {
      expect.assertions(6);

      const address1: MockNominative<number> = new MockNominative<number>(1);
      const address2: MockNominative<number> = new MockNominative<number>(2);
      const address3: MockNominative<number> = new MockNominative<number>(3);
      const address4: MockNominative<number> = new MockNominative<number>(4);

      const addresses1: MutableAddress<MockNominative<number>> = MutableAddress.ofSet<MockNominative<number>>(
        new Set<MockNominative<number>>([address1, address2, address3, address4])
      );
      const addresses2: MutableAddress<MockNominative<number>> = addresses1.map((v: MockNominative<number>) => {
        return new MockNominative(v.get() * 2);
      });

      expect(addresses1.size()).toBe(addresses2.size());
      expect(addresses1).not.toBe(addresses2);
      addresses2.forEach((v: MockNominative<number>) => {
        expect(v.get() % 2).toBe(0);
      });
    });
  });

  describe('duplicate', () => {
    it('returns shallow-copied instance', () => {
      expect.assertions(7);

      const address1: MockNominative<number> = new MockNominative<number>(1);
      const address2: MockNominative<number> = new MockNominative<number>(2);
      const address3: MockNominative<number> = new MockNominative<number>(3);
      const address4: MockNominative<number> = new MockNominative<number>(4);
      const address5: MockNominative<number> = new MockNominative<number>(5);

      const addresses1: MutableAddress<MockNominative<number>> = MutableAddress.ofSet<MockNominative<number>>(
        new Set<MockNominative<number>>([address1, address2, address3, address4])
      );
      const addresses2: MutableAddress<MockNominative<number>> = addresses1.duplicate();

      expect(addresses1.size()).toBe(addresses2.size());
      expect(addresses1).not.toBe(addresses2);
      expect(addresses2).toBe(addresses2.add(address5));
      addresses1.forEach((v: MockNominative<number>) => {
        expect(addresses2.contains(v)).toBe(true);
      });
    });
  });
});
