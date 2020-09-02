import { Equality } from '../Equality';
import { RecursiveReferenceError } from '../Error/RecursiveReferenceError';
import { PlainObject, PlainObjectItem } from '../Value';

describe('Equality', () => {
  describe('same', () => {
    it('true pattern', () => {
      expect.assertions(18);
      expect(Equality.same({}, {})).toBe(true);
      expect(
        Equality.same(
          {
            a: null
          },
          {
            a: null
          }
        )
      ).toBe(true);
      expect(
        Equality.same(
          {
            a: undefined
          },
          {
            a: undefined
          }
        )
      ).toBe(true);
      expect(
        Equality.same(
          {
            a: true
          },
          {
            a: true
          }
        )
      ).toBe(true);
      expect(
        Equality.same(
          {
            a: false
          },
          {
            a: false
          }
        )
      ).toBe(true);
      expect(
        Equality.same(
          {
            a: 'picture in picture'
          },
          {
            a: 'picture in picture'
          }
        )
      ).toBe(true);
      expect(
        Equality.same(
          {
            a: 0.001
          },
          {
            a: 0.001
          }
        )
      ).toBe(true);
      expect(
        Equality.same(
          {
            a: -0.001
          },
          {
            a: -0.001
          }
        )
      ).toBe(true);
      expect(
        Equality.same(
          {
            a: Infinity
          },
          {
            a: Infinity
          }
        )
      ).toBe(true);
      expect(
        Equality.same(
          {
            a: NaN
          },
          {
            a: NaN
          }
        )
      ).toBe(true);

      const sym: symbol = Symbol();

      expect(
        Equality.same(
          {
            a: sym
          },
          {
            a: sym
          }
        )
      ).toBe(true);
      expect(
        Equality.same(
          {
            a: 46n
          },
          {
            a: 46n
          }
        )
      ).toBe(true);
      expect(
        Equality.same(
          {
            a: {}
          },
          {
            a: {}
          }
        )
      ).toBe(true);
      expect(
        Equality.same(
          {
            a: {
              b: {
                c: undefined,
                d: {}
              }
            }
          },
          {
            a: {
              b: {
                c: undefined,
                d: {}
              }
            }
          }
        )
      ).toBe(true);
      expect(
        Equality.same(
          {
            a: []
          },
          {
            a: []
          }
        )
      ).toBe(true);
      expect(
        Equality.same(
          {
            a: [undefined, [undefined]]
          },
          {
            a: [undefined, [undefined]]
          }
        )
      ).toBe(true);
      expect(Equality.same([], [])).toBe(true);
      expect(Equality.same([undefined, [undefined]], [undefined, [undefined]])).toBe(true);
    });

    it('false pattern', () => {
      expect.assertions(11);
      expect(Equality.same({}, [])).toBe(false);
      expect(
        Equality.same(
          {
            a: null
          },
          {
            a: undefined
          }
        )
      ).toBe(false);
      expect(
        Equality.same(
          {
            a: 'colo'
          },
          {
            b: 'colo'
          }
        )
      ).toBe(false);
      expect(
        Equality.same(
          {
            a: true
          },
          {
            a: false
          }
        )
      ).toBe(false);
      expect(
        Equality.same(
          {
            a: false
          },
          {
            a: ''
          }
        )
      ).toBe(false);
      expect(
        Equality.same(
          {
            a: 0
          },
          {
            a: false
          }
        )
      ).toBe(false);
      expect(
        Equality.same(
          {
            a: 0.001
          },
          {
            a: 0.001,
            b: 0.002
          }
        )
      ).toBe(false);
      expect(
        Equality.same(
          {
            a: Symbol()
          },
          {
            a: Symbol()
          }
        )
      ).toBe(false);
      expect(
        Equality.same(
          {
            a: {
              b: {
                c: undefined,
                d: {}
              }
            }
          },
          {
            a: {
              e: {
                f: undefined,
                g: {}
              }
            }
          }
        )
      ).toBe(false);
      expect(
        Equality.same(
          {
            a: []
          },
          {
            a: [undefined]
          }
        )
      ).toBe(false);
      expect(Equality.same([], [undefined])).toBe(false);
    });
  });

  it('recursive detection pattern', () => {
    expect.assertions(10);
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
      Equality.same(obj1, {});
    }).toThrow(RecursiveReferenceError);
    expect(() => {
      Equality.same({}, obj2);
    }).toThrow(RecursiveReferenceError);
    expect(() => {
      Equality.same(obj1, obj2);
    }).toThrow(RecursiveReferenceError);
    expect(() => {
      Equality.same(arr, []);
    }).toThrow(RecursiveReferenceError);
    expect(() => {
      Equality.same([], arr);
    }).toThrow(RecursiveReferenceError);
    expect(() => {
      Equality.same(obj, {});
    }).toThrow(RecursiveReferenceError);
    expect(() => {
      Equality.same({}, obj);
    }).toThrow(RecursiveReferenceError);
    expect(() => {
      Equality.same(arr1, []);
    }).toThrow(RecursiveReferenceError);
    expect(() => {
      Equality.same([], arr2);
    }).toThrow(RecursiveReferenceError);
    expect(() => {
      Equality.same(arr1, arr2);
    }).toThrow(RecursiveReferenceError);
  });
});
