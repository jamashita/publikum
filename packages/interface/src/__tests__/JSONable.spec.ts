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
      expect(isJSONable<ObjectLiteral>(null)).toBe(false);
      expect(isJSONable<ObjectLiteral>(undefined)).toBe(false);
      expect(isJSONable<ObjectLiteral>('')).toBe(false);
      expect(isJSONable<ObjectLiteral>('123')).toBe(false);
      expect(isJSONable<ObjectLiteral>('abcd')).toBe(false);
      expect(isJSONable<ObjectLiteral>(123)).toBe(false);
      expect(isJSONable<ObjectLiteral>(0)).toBe(false);
      expect(isJSONable<ObjectLiteral>(false)).toBe(false);
      expect(isJSONable<ObjectLiteral>(true)).toBe(false);
      expect(isJSONable<ObjectLiteral>(Symbol())).toBe(false);
      expect(isJSONable<ObjectLiteral>(20n)).toBe(false);
      expect(isJSONable<ObjectLiteral>({})).toBe(false);
      expect(isJSONable<ObjectLiteral>([])).toBe(false);
      expect(
        isJSONable<ObjectLiteral>({
          toJSON() {
            // NOOP
          }
        })
      ).toBe(true);
      expect(isJSONable<ObjectLiteral>(new MockJSONable())).toBe(true);
    });
  });
});
