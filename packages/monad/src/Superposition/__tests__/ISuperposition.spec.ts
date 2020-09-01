import { MockError } from '@jamashita/publikum-object';
import { Chrono } from '../Chrono/Interface/Chrono';
import { containsError, isSuperposition } from '../Interface/ISuperposition';
import { Superposition } from '../Superposition';
import { SuperpositionInternal } from '../SuperpositionInternal';

describe('ISuperposition', () => {
  describe('is', () => {
    it('normal case', () => {
      const superposition1: Superposition<number, MockError> = Superposition.alive<number, MockError>(4);
      const superposition2: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.decline(new MockError());
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
          getError() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        isSuperposition<number, MockError>({
          get() {
            // NOOP
          },
          getError() {
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
          getError() {
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
          getError() {
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
          getError() {
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
          getError() {
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
          getError() {
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
          getError() {
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
          getError() {
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

  describe('containsError', () => {
    it('returns true if the very class is included', () => {
      const error: MockError = new MockError();

      expect(
        containsError<Error>(error, [TypeError, SyntaxError, MockError])
      ).toBe(true);
    });

    it('returns false if the class is not included', () => {
      const error: MockError = new MockError();

      expect(
        containsError<Error>(error, [TypeError, SyntaxError])
      ).toBe(false);
    });

    it('returns true if super class of the class is included', () => {
      const error: MockError = new MockError();

      expect(
        containsError<Error>(error, [TypeError, SyntaxError, Error])
      ).toBe(true);
    });
  });
});
