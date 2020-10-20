import { MockNominative } from '@jamashita/publikum-object';
import { ImmutableAddress } from '../ImmutableAddress';

describe('ImmutableAddress', () => {
  describe('of', () => {
    it('returns copied collection, does not use the same one', () => {
      expect.assertions(4);

      const value: ImmutableAddress<MockNominative<number>> = ImmutableAddress.ofSet<MockNominative<number>>(
        new Set<MockNominative<number>>([
          new MockNominative<number>(1),
          new MockNominative<number>(2)
        ])
      );
      const copied: ImmutableAddress<MockNominative<number>> = ImmutableAddress.of<MockNominative<number>>(value);

      expect(value.size()).toBe(copied.size());
      value.forEach((v: MockNominative<number>) => {
        expect(copied.contains(v)).toBe(true);
      });

      value.add(new MockNominative<number>(3));

      expect(value.size()).toBe(copied.size());
    });
  });

  describe('ofSet', () => {
    it('returns ImmutableAddress.empty() when the size is 0', () => {
      expect.assertions(2);

      const value: ImmutableAddress<MockNominative<number>> = ImmutableAddress.ofSet<MockNominative<number>>(new Set<MockNominative<number>>());

      expect(value.isEmpty()).toBe(true);
      expect(value).toBe(ImmutableAddress.empty<MockNominative<number>>());
    });

    it('returns instance', () => {
      expect.assertions(2);

      const value1: ImmutableAddress<MockNominative<number>> = ImmutableAddress.ofSet<MockNominative<number>>(
        new Set<MockNominative<number>>([new MockNominative<number>(1), new MockNominative<number>(3)])
      );
      const value2: ImmutableAddress<MockNominative<number>> = ImmutableAddress.ofSet<MockNominative<number>>(
        new Set<MockNominative<number>>([
          new MockNominative<number>(2),
          new MockNominative<number>(4),
          new MockNominative<number>(5)
        ])
      );

      expect(value1.size()).toBe(2);
      expect(value2.size()).toBe(3);
    });
  });

  describe('empty', () => {
    it('returns singleton singleton instance', () => {
      expect.assertions(1);

      expect(ImmutableAddress.empty<MockNominative<number>>()).toBe(ImmutableAddress.empty<MockNominative<number>>());
    });

    it('always returns 0-size set', () => {
      expect.assertions(1);

      const value: ImmutableAddress<MockNominative<number>> = ImmutableAddress.empty<MockNominative<number>>();

      expect(value.isEmpty()).toBe(true);
    });
  });

  describe('add', () => {
    it('can extend immutably', () => {
      expect.assertions(10);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);

      const address1: ImmutableAddress<MockNominative<number>> = ImmutableAddress.empty<MockNominative<number>>();

      expect(address1.size()).toBe(0);

      const address2: ImmutableAddress<MockNominative<number>> = address1.add(value1);

      expect(address1).not.toBe(address2);
      expect(address1.size()).toBe(0);
      expect(address2.size()).toBe(1);

      const address3: ImmutableAddress<MockNominative<number>> = address2.add(value2).add(value3);

      expect(address1).not.toBe(address2);
      expect(address2).not.toBe(address3);
      expect(address3).not.toBe(address1);
      expect(address1.size()).toBe(0);
      expect(address2.size()).toBe(1);
      expect(address3.size()).toBe(3);
    });

    it('does nothing when the arguments are already contained', () => {
      expect.assertions(3);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);

      const address1: ImmutableAddress<MockNominative<number>> = ImmutableAddress.ofSet<MockNominative<number>>(
        new Set<MockNominative<number>>([value1, value2])
      );
      const address2: ImmutableAddress<MockNominative<number>> = address1.add(value1);

      expect(address1).toBe(address2);
      expect(address1.size()).toBe(2);
      expect(address2.size()).toBe(2);
    });

    it('does nothing when the other same value object are already contained', () => {
      expect.assertions(3);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(1);

      const address1: ImmutableAddress<MockNominative<number>> = ImmutableAddress.ofSet<MockNominative<number>>(new Set<MockNominative<number>>([value1, value2]));
      const address2: ImmutableAddress<MockNominative<number>> = address1.add(value3);

      expect(address1).toBe(address2);
      expect(address1.size()).toBe(2);
      expect(address2.size()).toBe(2);
    });
  });

  describe('remove', () => {
    it('can remove retaining value if it contains', () => {
      expect.assertions(2);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);

      const address1: ImmutableAddress<MockNominative<number>> = ImmutableAddress.ofSet<MockNominative<number>>(
        new Set<MockNominative<number>>([value1, value2])
      );
      const address2: ImmutableAddress<MockNominative<number>> = address1.remove(value1);

      expect(address1.size()).toBe(2);
      expect(address2.size()).toBe(1);
    });

    it('does nothing when there is no such value', () => {
      expect.assertions(1);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);

      const address: ImmutableAddress<MockNominative<number>> = ImmutableAddress.ofSet<MockNominative<number>>(
        new Set<MockNominative<number>>([value1])
      );
      const beforeLength: number = address.size();

      expect(address.remove(value2)).toBe(address);
      expect(address.size()).toBe(beforeLength);
    });

    it('returns the removed Address', () => {
      expect.assertions(3);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(2);

      const address1: ImmutableAddress<MockNominative<number>> = ImmutableAddress.ofSet<MockNominative<number>>(
        new Set<MockNominative<number>>([value1, value2])
      );
      const address2: ImmutableAddress<MockNominative<number>> = address1.remove(value3);

      expect(address1).not.toBe(address2);
      expect(address1.size()).toBe(2);
      expect(address2.size()).toBe(1);
    });

    it('returns ImmutableAddress.empty() when the size will be 0', () => {
      expect.assertions(1);

      const value: MockNominative<number> = new MockNominative<number>(1);

      const address1: ImmutableAddress<MockNominative<number>> = ImmutableAddress.ofSet<MockNominative<number>>(new Set<MockNominative<number>>([value]));
      const address2: ImmutableAddress<MockNominative<number>> = address1.remove(value);

      expect(address2).toBe(ImmutableAddress.empty<MockNominative<number>>());
    });
  });

  describe('isEmpty', () => {
    it('returns true if the value size is 0', () => {
      expect.assertions(2);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);

      const address1: ImmutableAddress<MockNominative<number>> = ImmutableAddress.ofSet<MockNominative<number>>(
        new Set<MockNominative<number>>([value1, value2])
      );
      const address2: ImmutableAddress<MockNominative<number>> = ImmutableAddress.ofSet<MockNominative<number>>(
        new Set<MockNominative<number>>([])
      );

      expect(address1.isEmpty()).toBe(false);
      expect(address2.isEmpty()).toBe(true);
    });
  });

  describe('map', () => {
    it('execute the mapper function and returns mapped Address immutably', () => {
      expect.assertions(6);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);
      const value4: MockNominative<number> = new MockNominative<number>(4);

      const address1: ImmutableAddress<MockNominative<number>> = ImmutableAddress.ofSet<MockNominative<number>>(
        new Set<MockNominative<number>>([value1, value2, value3, value4])
      );
      const address2: ImmutableAddress<MockNominative<number>> = address1.map((v: MockNominative<number>) => {
        return new MockNominative(v.get() * 2);
      });

      expect(address1.size()).toBe(address2.size());
      expect(address1).not.toBe(address2);
      address2.forEach((v: MockNominative<number>) => {
        expect(v.get() % 2).toBe(0);
      });
    });
  });

  describe('duplicate', () => {
    it('returns ImmutableAddress.empty() when there are no values', () => {
      expect.assertions(1);

      const address: ImmutableAddress<MockNominative<number>> = ImmutableAddress.ofSet<MockNominative<number>>(
        new Set<MockNominative<number>>()
      );

      expect(address.duplicate()).toBe(ImmutableAddress.empty<MockNominative<number>>());
    });

    it('returns shallow-copied instance', () => {
      expect.assertions(7);

      const value1: MockNominative<number> = new MockNominative<number>(1);
      const value2: MockNominative<number> = new MockNominative<number>(2);
      const value3: MockNominative<number> = new MockNominative<number>(3);
      const value4: MockNominative<number> = new MockNominative<number>(4);
      const value5: MockNominative<number> = new MockNominative<number>(5);

      const address1: ImmutableAddress<MockNominative<number>> = ImmutableAddress.ofSet<MockNominative<number>>(
        new Set<MockNominative<number>>([value1, value2, value3, value4])
      );
      const address2: ImmutableAddress<MockNominative<number>> = address1.duplicate();

      expect(address1.size()).toBe(address2.size());
      expect(address1).not.toBe(address2);
      expect(address2).not.toBe(address2.add(value5));
      address1.forEach((v: MockNominative<number>) => {
        expect(address2.contains(v)).toBe(true);
      });
    });
  });
});
