import { Absent } from '../Absent';
import { QuantizationError } from '../Error/QuantizationError';

describe('Absent', () => {
  describe('get', () => {
    it('throws QuantizationError', () => {
      const absent1: Absent<void> = Absent.of();
      const absent2: Absent<number> = Absent.of<number>();

      expect(() => {
        absent1.get();
      }).toThrow(QuantizationError);
      expect(() => {
        absent2.get();
      }).toThrow(QuantizationError);
    });
  });

  describe('isPresent', () => {
    it('returns false', () => {
      const absent1: Absent<void> = Absent.of();
      const absent2: Absent<number> = Absent.of<number>();

      expect(absent1.isPresent()).toBe(false);
      expect(absent2.isPresent()).toBe(false);
    });
  });
  describe('isAbsent', () => {
    it('returns true', () => {
      const absent1: Absent<void> = Absent.of();
      const absent2: Absent<number> = Absent.of<number>();

      expect(absent1.isAbsent()).toBe(true);
      expect(absent2.isAbsent()).toBe(true);
    });
  });

  describe('isUncertain', () => {
    it('returns false', () => {
      const absent1: Absent<void> = Absent.of();
      const absent2: Absent<number> = Absent.of<number>();

      expect(absent1.isUncertain()).toBe(false);
      expect(absent2.isUncertain()).toBe(false);
    });
  });
});
