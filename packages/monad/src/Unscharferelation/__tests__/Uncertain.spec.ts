import { UnscharferelationError } from '../Error/UnscharferelationError';
import { Uncertain } from '../Uncertain';

describe('Uncertain', () => {
  describe('get', () => {
    it('throws UnscharferelationError', () => {
      const uncertain1: Uncertain<void> = Uncertain.of();
      const uncertain2: Uncertain<number> = Uncertain.of<number>();

      expect(() => {
        uncertain1.get();
      }).toThrow(UnscharferelationError);
      expect(() => {
        uncertain2.get();
      }).toThrow(UnscharferelationError);
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
