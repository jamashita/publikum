import { MockError } from '@jamashita/publikum-object';

import { Failed } from '../Failed';

describe('Failed', () => {
  describe('get', () => {
    it('throws given error', () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const failed1: Failed<void> = Failed.of<void>(error1);
      const failed2: Failed<number> = Failed.of<number>(error1);

      expect(() => {
        failed1.get();
      }).toThrow(error1);
      expect(() => {
        failed2.get();
      }).toThrow(error2);
    });
  });

  describe('getCause', () => {
    it('returns given error', () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const failed1: Failed<void> = Failed.of<void>(error1);
      const failed2: Failed<number> = Failed.of<number>(error2);

      expect(failed1.getCause()).toBe(error1);
      expect(failed2.getCause()).toBe(error2);
    });
  });

  describe('isReceived', () => {
    it('always returns false', () => {
      const error: MockError = new MockError();
      const failed: Failed<number> = Failed.of<number>(error);

      expect(failed.isReceived()).toBe(false);
    });
  });

  describe('isDisappeared', () => {
    it('always returns false', () => {
      const error: MockError = new MockError();
      const failed: Failed<number> = Failed.of<number>(error);

      expect(failed.isDisappeared()).toBe(false);
    });
  });

  describe('isFailed', () => {
    it('always returns true', () => {
      const error: MockError = new MockError();
      const failed: Failed<number> = Failed.of<number>(error);

      expect(failed.isFailed()).toBe(true);
    });
  });

  describe('isCancelled', () => {
    it('always returns false', () => {
      const error: MockError = new MockError();
      const failed: Failed<number> = Failed.of<number>(error);

      expect(failed.isCancelled()).toBe(false);
    });
  });
});
