import { Equalable, isEqualable } from '../Equalable';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MockEqualable implements Equalable<MockEqualable> {
  public equals(other: MockEqualable): boolean {
    return this === other;
  }
}

describe('Equalable', () => {
  describe('isEqualable', () => {
    it('normal case', () => {
      expect(isEqualable<MockEqualable>(null)).toBe(false);
      expect(isEqualable<MockEqualable>(undefined)).toBe(false);
      expect(isEqualable<MockEqualable>('')).toBe(false);
      expect(isEqualable<MockEqualable>('123')).toBe(false);
      expect(isEqualable<MockEqualable>('abcd')).toBe(false);
      expect(isEqualable<MockEqualable>(123)).toBe(false);
      expect(isEqualable<MockEqualable>(0)).toBe(false);
      expect(isEqualable<MockEqualable>(false)).toBe(false);
      expect(isEqualable<MockEqualable>(true)).toBe(false);
      expect(isEqualable<MockEqualable>(Symbol())).toBe(false);
      expect(isEqualable<MockEqualable>(20n)).toBe(false);
      expect(isEqualable<MockEqualable>({})).toBe(false);
      expect(isEqualable<MockEqualable>([])).toBe(false);
      expect(
        isEqualable<MockEqualable>({
          equals() {
            // NOOP
          }
        })
      ).toBe(true);
      expect(isEqualable<MockEqualable>(new MockEqualable())).toBe(true);
    });
  });
});
