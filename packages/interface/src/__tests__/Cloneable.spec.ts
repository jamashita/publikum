import { Cloneable, isCloneable } from '../Cloneable';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface MockCloneable extends Cloneable<MockCloneable> {
  // NOOP
}

describe('Cloneable', () => {
  describe('isCloneable', () => {
    it('normal case', () => {
      expect(isCloneable<MockCloneable>(null)).toBe(false);
      expect(isCloneable<MockCloneable>(undefined)).toBe(false);
      expect(isCloneable<MockCloneable>('')).toBe(false);
      expect(isCloneable<MockCloneable>('123')).toBe(false);
      expect(isCloneable<MockCloneable>('abcd')).toBe(false);
      expect(isCloneable<MockCloneable>(123)).toBe(false);
      expect(isCloneable<MockCloneable>(0)).toBe(false);
      expect(isCloneable<MockCloneable>(false)).toBe(false);
      expect(isCloneable<MockCloneable>(true)).toBe(false);
      expect(isCloneable<MockCloneable>(Symbol())).toBe(false);
      expect(isCloneable<MockCloneable>(20n)).toBe(false);
      expect(isCloneable<MockCloneable>({})).toBe(false);
      expect(isCloneable<MockCloneable>([])).toBe(false);
      expect(
        isCloneable<MockCloneable>({
          duplicate() {
            // NOOP
          }
        })
      ).toBe(true);
    });
  });
});
