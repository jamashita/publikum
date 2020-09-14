import { PlainObject, PlainObjectItem, RecursiveReferenceError } from '@jamashita/publikum-type';
import { Clone } from '../Clone';

describe('Clone', () => {
  describe('copy', () => {
    it('true pattern', () => {
      expect.assertions(18);
      expect(Clone.copy({})).toStrictEqual({});
      expect(
        Clone.copy({
          a: null
        })
      ).toStrictEqual({
        a: null
      });
      expect(
        Clone.copy({
          a: undefined
        })
      ).toStrictEqual({
        a: undefined
      });
      expect(
        Clone.copy({
          a: true
        })
      ).toStrictEqual({
        a: true
      });
      expect(
        Clone.copy({
          a: false
        })
      ).toStrictEqual({
        a: false
      });
      expect(
        Clone.copy({
          a: 'picture in picture'
        })
      ).toStrictEqual({
        a: 'picture in picture'
      });
      expect(
        Clone.copy({
          a: 0.001
        })
      ).toStrictEqual({
        a: 0.001
      });
      expect(
        Clone.copy({
          a: -0.001
        })
      ).toStrictEqual({
        a: -0.001
      });
      expect(
        Clone.copy({
          a: Infinity
        })
      ).toStrictEqual({
        a: Infinity
      });
      expect(
        Clone.copy({
          a: NaN
        })
      ).toStrictEqual({
        a: NaN
      });

      const sym: symbol = Symbol();

      expect(
        Clone.copy({
          a: sym
        })
      ).toStrictEqual({
        a: sym
      });
      expect(
        Clone.copy({
          a: 46n
        })
      ).toStrictEqual({
        a: 46n
      });
      expect(
        Clone.copy({
          a: {}
        })
      ).toStrictEqual({
        a: {}
      });
      expect(
        Clone.copy({
          a: {
            b: {
              c: undefined,
              d: {}
            }
          }
        })
      ).toStrictEqual({
        a: {
          b: {
            c: undefined,
            d: {}
          }
        }
      });
      expect(
        Clone.copy({
          a: []
        })
      ).toStrictEqual({
        a: []
      });
      expect(
        Clone.copy({
          a: [undefined, [undefined]]
        })
      ).toStrictEqual({
        a: [undefined, [undefined]]
      });
      expect(Clone.copy([])).toStrictEqual([]);
      expect(Clone.copy([undefined, [undefined]])).toStrictEqual([undefined, [undefined]]);
    });

    it('recursive detectiion pattern', () => {
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

      expect(() => {
        Clone.copy(obj1);
      }).toThrow(RecursiveReferenceError);
      expect(() => {
        Clone.copy(obj2);
      }).toThrow(RecursiveReferenceError);
      expect(() => {
        Clone.copy(arr);
      }).toThrow(RecursiveReferenceError);
      expect(() => {
        Clone.copy(obj);
      }).toThrow(RecursiveReferenceError);
      expect(() => {
        Clone.copy(arr1);
      }).toThrow(RecursiveReferenceError);
      expect(() => {
        Clone.copy(arr2);
      }).toThrow(RecursiveReferenceError);
    });
  });
});
