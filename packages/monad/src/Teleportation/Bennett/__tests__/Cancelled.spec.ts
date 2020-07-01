import { TeleportationError } from '../../Error/TeleportationError';
import { Cancelled } from '../Cancelled';

describe('Cancelled', () => {
  describe('of', () => {
    it('returns a single instance', () => {
      expect(Cancelled.of<number>()).toBe(Cancelled.of<number>());
    });
  });

  describe('get', () => {
    it('throws the inside error', () => {
      const cancelled: Cancelled<number> = Cancelled.of<number>();

      expect(() => {
        cancelled.get();
      }).toThrow(TeleportationError);
    });
  });

  describe('isReceived', () => {
    it('always returns false', () => {
      const cancelled: Cancelled<number> = Cancelled.of<number>();

      expect(cancelled.isReceived()).toBe(false);
    });
  });

  describe('isDisappeared', () => {
    it('always returns false', () => {
      const cancelled: Cancelled<number> = Cancelled.of<number>();

      expect(cancelled.isDisappeared()).toBe(false);
    });
  });
});
