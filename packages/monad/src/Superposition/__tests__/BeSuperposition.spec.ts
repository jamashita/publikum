import { MockError } from '@jamashita/publikum-object';

import { Epoque } from '../../Epoque/Interface/Epoque';
import { BeSuperposition } from '../BeSuperposition';
import { Alive } from '../Schrodinger/Alive';
import { Superposition } from '../Superposition';
import { SuperpositionInternal } from '../SuperpositionInternal';

describe('BeSuperposition', () => {
  describe('is', () => {
    it('normal case', () => {
      const superposition1: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Alive.of<number, MockError>(4)
      );
      const superposition2: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.decline(new MockError());
        },
        [MockError]
      );

      expect(BeSuperposition.is<number, MockError>(superposition1)).toBe(true);
      expect(BeSuperposition.is<number, MockError>(superposition2)).toBe(true);
      expect(BeSuperposition.is<number, MockError>(null)).toBe(false);
      expect(BeSuperposition.is<number, MockError>(undefined)).toBe(false);
      expect(BeSuperposition.is<number, MockError>('')).toBe(false);
      expect(BeSuperposition.is<number, MockError>('123')).toBe(false);
      expect(BeSuperposition.is<number, MockError>('abcd')).toBe(false);
      expect(BeSuperposition.is<number, MockError>(123)).toBe(false);
      expect(BeSuperposition.is<number, MockError>(0)).toBe(false);
      expect(BeSuperposition.is<number, MockError>(false)).toBe(false);
      expect(BeSuperposition.is<number, MockError>(true)).toBe(false);
      expect(BeSuperposition.is<number, MockError>(Symbol())).toBe(false);
      expect(BeSuperposition.is<number, MockError>(20n)).toBe(false);
      expect(BeSuperposition.is<number, MockError>({})).toBe(false);
      expect(BeSuperposition.is<number, MockError>([])).toBe(false);
      expect(
        BeSuperposition.is<number, MockError>({
          get() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        BeSuperposition.is<number, MockError>({
          get() {
            // NOOP
          },
          terminate() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        BeSuperposition.is<number, MockError>({
          get() {
            // NOOP
          },
          terminate() {
            // NOOP
          },
          filter() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        BeSuperposition.is<number, MockError>({
          get() {
            // NOOP
          },
          terminate() {
            // NOOP
          },
          filter() {
            // NOOP
          },
          map() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        BeSuperposition.is<number, MockError>({
          get() {
            // NOOP
          },
          terminate() {
            // NOOP
          },
          filter() {
            // NOOP
          },
          map() {
            // NOOP
          },
          recover() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        BeSuperposition.is<number, MockError>({
          get() {
            // NOOP
          },
          terminate() {
            // NOOP
          },
          filter() {
            // NOOP
          },
          map() {
            // NOOP
          },
          recover() {
            // NOOP
          },
          transform() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        BeSuperposition.is<number, MockError>({
          get() {
            // NOOP
          },
          terminate() {
            // NOOP
          },
          filter() {
            // NOOP
          },
          map() {
            // NOOP
          },
          recover() {
            // NOOP
          },
          transform() {
            // NOOP
          },
          pass() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        BeSuperposition.is<number, MockError>({
          get() {
            // NOOP
          },
          terminate() {
            // NOOP
          },
          filter() {
            // NOOP
          },
          map() {
            // NOOP
          },
          recover() {
            // NOOP
          },
          transform() {
            // NOOP
          },
          pass() {
            // NOOP
          },
          toUnscharferelation() {
            // NOOP
          }
        })
      ).toBe(true);
    });
  });
});
