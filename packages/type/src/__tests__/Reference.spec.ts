import { Reference } from '../Reference';
import { PlainObject, PlainObjectItem } from '../Value';

describe('Reference', () => {
  describe('isRecursive', () => {
    it('return false when given objects do not have recusive reference', () => {
      expect(Reference.isRecursive({})).toBe(false);
      expect(
        Reference.isRecursive({
          a: null
        })
      ).toBe(false);
      expect(
        Reference.isRecursive({
          a: undefined
        })
      ).toBe(false);
      expect(
        Reference.isRecursive({
          a: true
        })
      ).toBe(false);
      expect(
        Reference.isRecursive({
          a: false
        })
      ).toBe(false);
      expect(
        Reference.isRecursive({
          a: 'picture in picture'
        })
      ).toBe(false);
      expect(
        Reference.isRecursive({
          a: 0.001
        })
      ).toBe(false);
      expect(
        Reference.isRecursive({
          a: -0.001
        })
      ).toBe(false);
      expect(
        Reference.isRecursive({
          a: Infinity
        })
      ).toBe(false);
      expect(
        Reference.isRecursive({
          a: NaN
        })
      ).toBe(false);
      expect(
        Reference.isRecursive({
          a: Symbol()
        })
      ).toBe(false);
      expect(
        Reference.isRecursive({
          a: 46n
        })
      ).toBe(false);
      expect(
        Reference.isRecursive({
          a: {}
        })
      ).toBe(false);
      expect(
        Reference.isRecursive({
          a: {
            b: {
              c: undefined,
              d: {}
            }
          }
        })
      ).toBe(false);
      expect(
        Reference.isRecursive({
          a: []
        })
      ).toBe(false);
      expect(
        Reference.isRecursive({
          a: [undefined, [undefined]]
        })
      ).toBe(false);
      expect(Reference.isRecursive([])).toBe(false);
      expect(Reference.isRecursive([undefined, [undefined]])).toBe(false);
    });

    it('recursive detectiion pattern', () => {
      const obj1: PlainObject = {
        a: 'noi'
      };
      const obj2: PlainObject = {
        b: 'voi',
        o: obj1
      };

      obj1.o = obj2;

      const arr: Array<PlainObject> = [];
      const obj: PlainObject = {
        arr
      };

      arr.push(obj);

      const arr1: Array<PlainObjectItem> = [];
      const arr2: Array<PlainObjectItem> = [arr1];

      arr1.push(arr2);

      expect(Reference.isRecursive(obj1)).toBe(true);
      expect(Reference.isRecursive(obj2)).toBe(true);
      expect(Reference.isRecursive(arr)).toBe(true);
      expect(Reference.isRecursive(obj)).toBe(true);
      expect(Reference.isRecursive(arr1)).toBe(true);
      expect(Reference.isRecursive(arr2)).toBe(true);
    });
  });
});
