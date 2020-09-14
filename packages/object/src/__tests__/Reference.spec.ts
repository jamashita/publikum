import { PlainObject, PlainObjectItem } from '@jamashita/publikum-type';
import { Reference } from '../Reference';

describe('Reference', () => {
  describe('isCircular', () => {
    it('return false when given objects do not have recursive reference', () => {
      expect.assertions(18);
      expect(Reference.isCircular({})).toBe(false);
      expect(
        Reference.isCircular({
          a: null
        })
      ).toBe(false);
      expect(
        Reference.isCircular({
          a: undefined
        })
      ).toBe(false);
      expect(
        Reference.isCircular({
          a: true
        })
      ).toBe(false);
      expect(
        Reference.isCircular({
          a: false
        })
      ).toBe(false);
      expect(
        Reference.isCircular({
          a: 'picture in picture'
        })
      ).toBe(false);
      expect(
        Reference.isCircular({
          a: 0.001
        })
      ).toBe(false);
      expect(
        Reference.isCircular({
          a: -0.001
        })
      ).toBe(false);
      expect(
        Reference.isCircular({
          a: Infinity
        })
      ).toBe(false);
      expect(
        Reference.isCircular({
          a: NaN
        })
      ).toBe(false);
      expect(
        Reference.isCircular({
          a: Symbol()
        })
      ).toBe(false);
      expect(
        Reference.isCircular({
          a: 46n
        })
      ).toBe(false);
      expect(
        Reference.isCircular({
          a: {}
        })
      ).toBe(false);
      expect(
        Reference.isCircular({
          a: {
            b: {
              c: undefined,
              d: {}
            }
          }
        })
      ).toBe(false);
      expect(
        Reference.isCircular({
          a: []
        })
      ).toBe(false);
      expect(
        Reference.isCircular({
          a: [undefined, [undefined]]
        })
      ).toBe(false);
      expect(Reference.isCircular([])).toBe(false);
      expect(Reference.isCircular([undefined, [undefined]])).toBe(false);
    });

    it('recursive detection pattern', () => {
      expect.assertions(6);
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

      expect(Reference.isCircular(obj1)).toBe(true);
      expect(Reference.isCircular(obj2)).toBe(true);
      expect(Reference.isCircular(arr)).toBe(true);
      expect(Reference.isCircular(obj)).toBe(true);
      expect(Reference.isCircular(arr1)).toBe(true);
      expect(Reference.isCircular(arr2)).toBe(true);
    });
  });
});
