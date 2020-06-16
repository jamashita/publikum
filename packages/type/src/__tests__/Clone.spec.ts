import { Clone } from '../Clone';
import { RecursiveReferenceError } from '../Error/RecursiveReferenceError';
import { PlainObject, PlainObjectItem } from '../Value';

describe('Clone', () => {
  describe('copy', () => {
    it('true pattern', () => {
      expect(Clone.copy({})).toEqual({});
      expect(
        Clone.copy({
          a: null
        })
      ).toEqual({
        a: null
      });
      expect(
        Clone.copy({
          a: undefined
        })
      ).toEqual({
        a: undefined
      });
      expect(
        Clone.copy({
          a: true
        })
      ).toEqual({
        a: true
      });
      expect(
        Clone.copy({
          a: false
        })
      ).toEqual({
        a: false
      });
      expect(
        Clone.copy({
          a: 'picture in picture'
        })
      ).toEqual({
        a: 'picture in picture'
      });
      expect(
        Clone.copy({
          a: 0.001
        })
      ).toEqual({
        a: 0.001
      });
      expect(
        Clone.copy({
          a: -0.001
        })
      ).toEqual({
        a: -0.001
      });
      expect(
        Clone.copy({
          a: Infinity
        })
      ).toEqual({
        a: Infinity
      });
      expect(
        Clone.copy({
          a: NaN
        })
      ).toEqual({
        a: NaN
      });

      const sym: symbol = Symbol();

      expect(
        Clone.copy({
          a: sym
        })
      ).toEqual({
        a: sym
      });
      expect(
        Clone.copy({
          a: 46n
        })
      ).toEqual({
        a: 46n
      });
      expect(
        Clone.copy({
          a: {}
        })
      ).toEqual({
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
      ).toEqual({
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
      ).toEqual({
        a: []
      });
      expect(
        Clone.copy({
          a: [undefined, [undefined]]
        })
      ).toEqual({
        a: [undefined, [undefined]]
      });
      expect(Clone.copy([])).toEqual([]);
      expect(Clone.copy([undefined, [undefined]])).toEqual([undefined, [undefined]]);
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
