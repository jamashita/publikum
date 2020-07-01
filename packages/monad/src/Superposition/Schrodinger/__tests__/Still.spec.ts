import { MockError } from '@jamashita/publikum-object';

import { SuperpositionError } from '../../Error/SuperpositionError';
import { Still } from '../Still';

describe('Still', () => {
  describe('of', () => {
    it('returns a single instance', () => {
      expect(Still.of<number, MockError>()).toBe(Still.of<number, MockError>());
    });
  });

  describe('get', () => {
    it('throws the inside error', () => {
      const still: Still<number, MockError> = Still.of<number, MockError>();

      expect(() => {
        still.get();
      }).toThrow(SuperpositionError);
    });
  });

  describe('isAlive', () => {
    it('always returns false', () => {
      const still: Still<number, MockError> = Still.of<number, MockError>();

      expect(still.isAlive()).toBe(false);
    });
  });

  describe('isDead', () => {
    it('always returns false', () => {
      const still: Still<number, MockError> = Still.of<number, MockError>();

      expect(still.isDead()).toBe(false);
    });
  });

  describe('transpose', () => {
    it('returns itself', () => {
      const still: Still<number, MockError> = Still.of<number, MockError>();

      expect(still.transpose<void, MockError>()).toBe(still);
    });
  });
});
