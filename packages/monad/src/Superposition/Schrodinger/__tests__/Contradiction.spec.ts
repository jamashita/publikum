import { MockError } from '@jamashita/publikum-object';

import { SuperpositionError } from '../../Error/SuperpositionError';
import { Contradiction } from '../Contradiction';

describe('Contradiction', () => {
  describe('of', () => {
    it('returns a single instance', () => {
      expect(Contradiction.of<number, MockError>()).toBe(Contradiction.of<number, MockError>());
    });
  });

  describe('get', () => {
    it('throws the inside error', () => {
      const still: Contradiction<number, MockError> = Contradiction.of<number, MockError>();

      expect(() => {
        still.get();
      }).toThrow(SuperpositionError);
    });
  });

  describe('isAlive', () => {
    it('always returns false', () => {
      const still: Contradiction<number, MockError> = Contradiction.of<number, MockError>();

      expect(still.isAlive()).toBe(false);
    });
  });

  describe('isDead', () => {
    it('always returns false', () => {
      const still: Contradiction<number, MockError> = Contradiction.of<number, MockError>();

      expect(still.isDead()).toBe(false);
    });
  });

  describe('isContradiction', () => {
    it('always returns true', () => {
      const still: Contradiction<number, MockError> = Contradiction.of<number, MockError>();

      expect(still.isContradiction()).toBe(true);
    });
  });
});
