import { Epoque } from '../../Epoque/Interface/Epoque';
import { BeUnscharferelation } from '../BeUnscharferelation';
import { Present } from '../Heisenberg/Present';
import { Unscharferelation } from '../Unscharferelation';
import { UnscharferelationInternal } from '../UnscharferelationInternal';

describe('BeUnscharferelation', () => {
  describe('is', () => {
    it('normal case', () => {
      const unscharferelation1: Unscharferelation<number> = Unscharferelation.ofHeisenberg<number>(
        Present.of<number>(4)
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.decline();
        }
      );

      expect(BeUnscharferelation.is<number>(null)).toBe(false);
      expect(BeUnscharferelation.is<number>(undefined)).toBe(false);
      expect(BeUnscharferelation.is<number>('')).toBe(false);
      expect(BeUnscharferelation.is<number>('123')).toBe(false);
      expect(BeUnscharferelation.is<number>('abcd')).toBe(false);
      expect(BeUnscharferelation.is<number>(123)).toBe(false);
      expect(BeUnscharferelation.is<number>(0)).toBe(false);
      expect(BeUnscharferelation.is<number>(false)).toBe(false);
      expect(BeUnscharferelation.is<number>(true)).toBe(false);
      expect(BeUnscharferelation.is<number>(Symbol())).toBe(false);
      expect(BeUnscharferelation.is<number>(20n)).toBe(false);
      expect(BeUnscharferelation.is<number>({})).toBe(false);
      expect(BeUnscharferelation.is<number>([])).toBe(false);
      expect(
        BeUnscharferelation.is<number>({
          get() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        BeUnscharferelation.is<number>({
          get() {
            // NOOP
          },
          terminate() {
            // NOOP
          }
        })
      ).toBe(false);
      expect(
        BeUnscharferelation.is<number>({
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
        BeUnscharferelation.is<number>({
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
        BeUnscharferelation.is<number>({
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
        BeUnscharferelation.is<number>({
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
          toSuperposition() {
            // NOOP
          }
        })
      ).toBe(true);
      expect(BeUnscharferelation.is<number>(unscharferelation1)).toBe(true);
      expect(BeUnscharferelation.is<number>(unscharferelation2)).toBe(true);
    });
  });
});
