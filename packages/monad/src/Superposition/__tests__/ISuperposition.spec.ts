import { MockError } from '@jamashita/publikum-object';

import { Epoque } from '../../Epoque/Interface/Epoque';
import { isSuperposition } from '../Interface/ISuperposition';
import { Superposition } from '../Superposition';
import { SuperpositionInternal } from '../SuperpositionInternal';

describe('ISuperposition', () => {
  describe('is', () => {
    it('normal case', () => {
      const superposition1: Superposition<number, MockError> = Superposition.alive<number, MockError>(4);
      const superposition2: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.decline(new MockError());
        },
        [MockError]
      );

      expect(isSuperposition<number, MockError>(null)).toBe(false);
      expect(isSuperposition<number, MockError>(undefined)).toBe(false);
      expect(isSuperposition<number, MockError>('')).toBe(false);
      expect(isSuperposition<number, MockError>('123')).toBe(false);
      expect(isSuperposition<number, MockError>('abcd')).toBe(false);
      expect(isSuperposition<number, MockError>(123)).toBe(false);
      expect(isSuperposition<number, MockError>(0)).toBe(false);
      expect(isSuperposition<number, MockError>(false)).toBe(false);
      expect(isSuperposition<number, MockError>(true)).toBe(false);
      expect(isSuperposition<number, MockError>(Symbol())).toBe(false);
      expect(isSuperposition<number, MockError>(20n)).toBe(false);
      expect(isSuperposition<number, MockError>({})).toBe(false);
      expect(isSuperposition<number, MockError>([])).toBe(false);
      expect(
        isSuperposition<number, MockError>({
          get() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        isSuperposition<number, MockError>({
          get() {
            // NOOP
          },
          terminate() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        isSuperposition<number, MockError>({
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
        isSuperposition<number, MockError>({
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
        isSuperposition<number, MockError>({
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
        isSuperposition<number, MockError>({
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
        isSuperposition<number, MockError>({
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
        isSuperposition<number, MockError>({
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
          peek() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        isSuperposition<number, MockError>({
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
          peek() {
            // NOOP
          },
          toUnscharferelation() {
            // NOOP
          }
        })
      ).toBe(true);
      expect(isSuperposition<number, MockError>(superposition1)).toBe(true);
      expect(isSuperposition<number, MockError>(superposition2)).toBe(true);
    });
  });
});
