import { Cloneable, isCloneable } from '../Cloneable';

class MockCloneable implements Cloneable<MockCloneable> {
  public duplicate(): MockCloneable {
    return new MockCloneable();
  }
}

describe('Cloneable', () => {
  describe('isCloneable', () => {
    it('returns true if the object has duplicate()', () => {
      expect.assertions(15);

      expect(isCloneable(null)).toBe(false);
      expect(isCloneable(undefined)).toBe(false);
      expect(isCloneable('')).toBe(false);
      expect(isCloneable('123')).toBe(false);
      expect(isCloneable('abcd')).toBe(false);
      expect(isCloneable(123)).toBe(false);
      expect(isCloneable(0)).toBe(false);
      expect(isCloneable(false)).toBe(false);
      expect(isCloneable(true)).toBe(false);
      expect(isCloneable(Symbol())).toBe(false);
      expect(isCloneable(20n)).toBe(false);
      expect(isCloneable({})).toBe(false);
      expect(isCloneable([])).toBe(false);
      expect(
        isCloneable({
          duplicate() {
            // NOOP
          }
        })
      ).toBe(true);
      expect(isCloneable(new MockCloneable())).toBe(true);
    });
  });
});
