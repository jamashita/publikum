import { Equality } from '../Equality';

describe('Equality', () => {
  describe('same', () => {
    it('true pattern', () => {
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
            a: []
          },
          {
            a: []
          }
        )
      ).toBe(true);
    });
  });
});
