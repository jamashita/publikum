import { TeleportationError } from '../../Error/TeleportationError';
import { Pending } from '../Pending';

describe('Pending', () => {
  describe('get', () => {
    it('throws the inside error', () => {
      const pending: Pending<number> = Pending.of<number>();

      expect(() => {
        pending.get();
      }).toThrow(TeleportationError);
    });
  });

  describe('isReceived', () => {
    it('always returns false', () => {
      const pending: Pending<number> = Pending.of<number>();

      expect(pending.isReceived()).toBe(false);
    });
  });

  describe('isDisappeared', () => {
    it('always returns false', () => {
      const pending: Pending<number> = Pending.of<number>();

      expect(pending.isDisappeared()).toBe(false);
    });
  });

  describe('isFailed', () => {
    it('always returns false', () => {
      const pending: Pending<number> = Pending.of<number>();

      expect(pending.isFailed()).toBe(false);
    });
  });

  describe('isCancelled', () => {
    it('always returns false', () => {
      const pending: Pending<number> = Pending.of<number>();

      expect(pending.isCancelled()).toBe(false);
    });
  });
});
