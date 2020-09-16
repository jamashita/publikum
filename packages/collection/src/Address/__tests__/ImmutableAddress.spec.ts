import { MockNominative } from '@jamashita/publikum-object';
import { ImmutableAddress } from '../ImmutableAddress';

describe('ImmutableAddress', () => {
  describe('of', () => {
    it('when the arguments specified with 0 length set, returns ImmutableAddress.empty()', () => {
      expect.assertions(2);

      const address: ImmutableAddress<MockNominative<number>> = ImmutableAddress.of<MockNominative<number>>(
        new Set<MockNominative<number>>()
      );

      expect(address.isEmpty()).toBe(true);
      expect(address).toBe(ImmutableAddress.empty<MockNominative<number>>());
    });

    it('normal case', () => {
      expect.assertions(2);

      const address1: ImmutableAddress<MockNominative<number>> = ImmutableAddress.of<MockNominative<number>>(
        new Set<MockNominative<number>>([new MockNominative<number>(1), new MockNominative<number>(3)])
      );
      const address2: ImmutableAddress<MockNominative<number>> = ImmutableAddress.of<MockNominative<number>>(
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
    it('always empty, the size is 0', () => {
      expect.assertions(1);

      const address: ImmutableAddress<MockNominative<number>> = ImmutableAddress.empty<MockNominative<number>>();

      expect(address.isEmpty()).toBe(true);
    });

    it('returns singleton empty Address', () => {
      expect.assertions(1);

      expect(ImmutableAddress.empty<MockNominative<number>>()).toBe(ImmutableAddress.empty<MockNominative<number>>());
    });
  });

  describe('add', () => {
    it('can extend immutably', () => {
      expect.assertions(10);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);

      const nouns1: ImmutableAddress<MockNominative<number>> = ImmutableAddress.empty<MockNominative<number>>();

      expect(nouns1.size()).toBe(0);

      const nouns2: ImmutableAddress<MockNominative<number>> = nouns1.add(noun1);

      expect(nouns1).not.toBe(nouns2);
      expect(nouns1.size()).toBe(0);
      expect(nouns2.size()).toBe(1);

      const nouns3: ImmutableAddress<MockNominative<number>> = nouns2.add(noun2).add(noun3);

      expect(nouns1).not.toBe(nouns2);
      expect(nouns2).not.toBe(nouns3);
      expect(nouns3).not.toBe(nouns1);
      expect(nouns1.size()).toBe(0);
      expect(nouns2.size()).toBe(1);
      expect(nouns3.size()).toBe(3);
    });

    it('does nothing when the arguments are already contained', () => {
      expect.assertions(3);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: ImmutableAddress<MockNominative<number>> = ImmutableAddress.of<MockNominative<number>>(
        new Set<MockNominative<number>>([noun1, noun2])
      );
      const nouns2: ImmutableAddress<MockNominative<number>> = nouns1.add(noun1);

      expect(nouns1).toBe(nouns2);
      expect(nouns1.size()).toBe(2);
      expect(nouns2.size()).toBe(2);
    });

    it('does nothing when the same value other object are already contained', () => {
      expect.assertions(3);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(1);

      const nouns1: ImmutableAddress<MockNominative<number>> = ImmutableAddress.of<MockNominative<number>>(
        new Set<MockNominative<number>>([noun1, noun2])
      );
      const nouns2: ImmutableAddress<MockNominative<number>> = nouns1.add(noun3);

      expect(nouns1).toBe(nouns2);
      expect(nouns1.size()).toBe(2);
      expect(nouns2.size()).toBe(2);
    });
  });

  describe('remove', () => {
    it('normal case', () => {
      expect.assertions(2);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: ImmutableAddress<MockNominative<number>> = ImmutableAddress.of<MockNominative<number>>(
        new Set<MockNominative<number>>([noun1, noun2])
      );
      const nouns2: ImmutableAddress<MockNominative<number>> = nouns1.remove(noun1);

      expect(nouns1.size()).toBe(2);
      expect(nouns2.size()).toBe(1);
    });

    it('does nothing because the address is already nothing', () => {
      expect.assertions(1);

      const noun: MockNominative<number> = new MockNominative<number>(1);

      const nouns: ImmutableAddress<MockNominative<number>> = ImmutableAddress.empty<MockNominative<number>>();

      expect(nouns.remove(noun)).toBe(nouns);
    });

    it('returns the value even if the other', () => {
      expect.assertions(3);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: ImmutableAddress<MockNominative<number>> = ImmutableAddress.of<MockNominative<number>>(
        new Set<MockNominative<number>>([noun1, noun2])
      );
      const nouns2: ImmutableAddress<MockNominative<number>> = nouns1.remove(noun3);

      expect(nouns1).not.toBe(nouns2);
      expect(nouns1.size()).toBe(2);
      expect(nouns2.size()).toBe(1);
    });

    it('does not contains the value, returns itself', () => {
      expect.assertions(3);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);

      const nouns1: ImmutableAddress<MockNominative<number>> = ImmutableAddress.of<MockNominative<number>>(
        new Set<MockNominative<number>>([noun1, noun2])
      );
      const nouns2: ImmutableAddress<MockNominative<number>> = nouns1.remove(noun3);

      expect(nouns1).toBe(nouns2);
      expect(nouns1.size()).toBe(2);
      expect(nouns2.size()).toBe(2);
    });

    it('returns ImmutableAddress.empty() when the size will be 0', () => {
      expect.assertions(1);

      const noun1: MockNominative<number> = new MockNominative<number>(1);

      const nouns1: ImmutableAddress<MockNominative<number>> = ImmutableAddress.of<MockNominative<number>>(
        new Set<MockNominative<number>>([noun1])
      );
      const nouns2: ImmutableAddress<MockNominative<number>> = nouns1.remove(noun1);

      expect(nouns2).toBe(ImmutableAddress.empty<MockNominative<number>>());
    });
  });

  describe('isEmpty', () => {
    it('returns true if the elements are 0', () => {
      expect.assertions(2);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);

      const nouns1: ImmutableAddress<MockNominative<number>> = ImmutableAddress.of<MockNominative<number>>(
        new Set<MockNominative<number>>([noun1, noun2])
      );
      const nouns2: ImmutableAddress<MockNominative<number>> = ImmutableAddress.of<MockNominative<number>>(
        new Set<MockNominative<number>>([])
      );

      expect(nouns1.isEmpty()).toBe(false);
      expect(nouns2.isEmpty()).toBe(true);
    });
  });

  describe('duplicate', () => {
    it('normal case', () => {
      expect.assertions(2);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(4);

      const nouns1: ImmutableAddress<MockNominative<number>> = ImmutableAddress.of<MockNominative<number>>(
        new Set<MockNominative<number>>([noun1, noun2, noun3, noun4])
      );
      const nouns2: ImmutableAddress<MockNominative<number>> = nouns1.duplicate();

      expect(nouns1.size()).toBe(nouns2.size());
      expect(nouns1).not.toBe(nouns2);
    });

    it('does not affect original one', () => {
      expect.assertions(4);

      const noun1: MockNominative<number> = new MockNominative<number>(1);
      const noun2: MockNominative<number> = new MockNominative<number>(2);
      const noun3: MockNominative<number> = new MockNominative<number>(3);
      const noun4: MockNominative<number> = new MockNominative<number>(4);

      const nouns1: ImmutableAddress<MockNominative<number>> = ImmutableAddress.of<MockNominative<number>>(
        new Set<MockNominative<number>>([noun1, noun2, noun3])
      );
      const nouns2: ImmutableAddress<MockNominative<number>> = nouns1.duplicate();
      const nouns3: ImmutableAddress<MockNominative<number>> = nouns2.add(noun4);

      expect(nouns1.size()).toBe(nouns2.size());
      expect(nouns2.size()).not.toBe(nouns3.size());
      expect(nouns1).not.toBe(nouns2);
      expect(nouns2).not.toBe(nouns3);
    });

    it('returns ImmutableAddress.empty() when there are no items', () => {
      expect.assertions(1);

      const nouns: ImmutableAddress<MockNominative<number>> = ImmutableAddress.of<MockNominative<number>>(new Set());

      expect(nouns.duplicate()).toBe(nouns);
    });
  });
});
