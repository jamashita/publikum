import { UnscharferelationError } from '../../Error/UnscharferelationError';
import { Absent } from '../Absent';

describe('Absent', () => {
  describe('get', () => {
    it('throws UnscharferelationError', () => {
      const absent1: Absent<void> = Absent.of<void>();
      const absent2: Absent<number> = Absent.of<number>();

      expect(() => {
        absent1.get();
      }).toThrow(UnscharferelationError);
      expect(() => {
        absent2.get();
      }).toThrow(UnscharferelationError);
    });
  });

  describe('isPresent', () => {
    it('returns false', () => {
      const absent1: Absent<void> = Absent.of<void>();
      const absent2: Absent<number> = Absent.of<number>();

      expect(absent1.isPresent()).toBe(false);
      expect(absent2.isPresent()).toBe(false);
    });
  });
  describe('isAbsent', () => {
    it('returns true', () => {
      const absent1: Absent<void> = Absent.of<void>();
      const absent2: Absent<number> = Absent.of<number>();

      expect(absent1.isAbsent()).toBe(true);
      expect(absent2.isAbsent()).toBe(true);
    });
  });

  describe('isSettled', () => {
    it('returns true', () => {
      const absent1: Absent<void> = Absent.of<void>();
      const absent2: Absent<number> = Absent.of<number>();

      expect(absent1.isSettled()).toBe(true);
      expect(absent2.isSettled()).toBe(true);
    });
  });
});
