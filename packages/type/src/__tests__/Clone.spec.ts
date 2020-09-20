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
  });
});
