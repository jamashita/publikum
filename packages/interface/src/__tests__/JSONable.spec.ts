import { ObjectLiteral } from '@jamashita/publikum-type';
import { isJSONable, JSONable } from '../JSONable';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MockJSONable implements JSONable {
  public toJSON(): ObjectLiteral {
    return {};
  }
}

describe('JSONable', () => {
  describe('isJSONable', () => {
    it('normal case', () => {
      expect(isJSONable(null)).toBe(false);
      expect(isJSONable(undefined)).toBe(false);
      expect(isJSONable('')).toBe(false);
      expect(isJSONable('123')).toBe(false);
      expect(isJSONable('abcd')).toBe(false);
      expect(isJSONable(123)).toBe(false);
      expect(isJSONable(0)).toBe(false);
      expect(isJSONable(false)).toBe(false);
      expect(isJSONable(true)).toBe(false);
      expect(isJSONable(Symbol())).toBe(false);
      expect(isJSONable(20n)).toBe(false);
      expect(isJSONable({})).toBe(false);
      expect(isJSONable([])).toBe(false);
      expect(
        isJSONable({
          toJSON() {
            // NOOP
          }
        })
      ).toBe(true);
      expect(isJSONable(new MockJSONable())).toBe(true);
    });
  });
});
