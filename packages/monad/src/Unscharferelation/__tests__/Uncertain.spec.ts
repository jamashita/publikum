import { QuantizationError } from '../Error/QuantizationError';
import { Uncertain } from '../Uncertain';

describe('Uncertain', () => {
  describe('get', () => {
    it('throws QuantizationError', () => {
      const uncertain1: Uncertain<void> = Uncertain.of();
      const uncertain2: Uncertain<number> = Uncertain.of<number>();

      expect(() => {
        uncertain1.get();
      }).toThrow(QuantizationError);
      expect(() => {
        uncertain2.get();
      }).toThrow(QuantizationError);
    });
  });

  describe('isPresent', () => {
    it('returns false', () => {
      const uncertain1: Uncertain<void> = Uncertain.of();
      const uncertain2: Uncertain<number> = Uncertain.of<number>();

      expect(uncertain1.isPresent()).toBe(false);
      expect(uncertain2.isPresent()).toBe(false);
    });
  });
  describe('isAbsent', () => {
    it('returns false', () => {
      const uncertain1: Uncertain<void> = Uncertain.of();
      const uncertain2: Uncertain<number> = Uncertain.of<number>();

      expect(uncertain1.isAbsent()).toBe(false);
      expect(uncertain2.isAbsent()).toBe(false);
    });
  });

  describe('isUncertain', () => {
    it('returns true', () => {
      const uncertain1: Uncertain<void> = Uncertain.of();
      const uncertain2: Uncertain<number> = Uncertain.of<number>();

      expect(uncertain1.isUncertain()).toBe(true);
      expect(uncertain2.isUncertain()).toBe(true);
    });
  });
});
