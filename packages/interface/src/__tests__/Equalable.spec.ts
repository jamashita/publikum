import { Equalable, isEqualable } from '../Equalable';

class MockEqualable implements Equalable<MockEqualable> {
  public equals(other: MockEqualable): boolean {
    return this === other;
  }
}

describe('Equalable', () => {
  describe('isEqualable', () => {
    it('normal case', () => {
      expect.assertions(15);
      expect(isEqualable(null)).toBe(false);
      expect(isEqualable(undefined)).toBe(false);
      expect(isEqualable('')).toBe(false);
      expect(isEqualable('123')).toBe(false);
      expect(isEqualable('abcd')).toBe(false);
      expect(isEqualable(123)).toBe(false);
      expect(isEqualable(0)).toBe(false);
      expect(isEqualable(false)).toBe(false);
      expect(isEqualable(true)).toBe(false);
      expect(isEqualable(Symbol())).toBe(false);
      expect(isEqualable(20n)).toBe(false);
      expect(isEqualable({})).toBe(false);
      expect(isEqualable([])).toBe(false);
      expect(
        isEqualable({
          equals() {
            // NOOP
          }
        })
      ).toBe(true);
      expect(isEqualable(new MockEqualable())).toBe(true);
    });
  });
});
