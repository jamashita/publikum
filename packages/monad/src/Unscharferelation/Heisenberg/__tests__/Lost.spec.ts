import { MockError } from '@jamashita/publikum-object';

import { Lost } from '../Lost';

describe('Lost', () => {
  describe('get', () => {
    it('throws given error', () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const lost1: Lost<void> = Lost.of<void>(error1);
      const lost2: Lost<number> = Lost.of<number>(error2);

      expect(() => {
        lost1.get();
      }).toThrow(error1);
      expect(() => {
        lost2.get();
      }).toThrow(error2);
    });
  });

  describe('isPresent', () => {
    it('returns false', () => {
      const error: MockError = new MockError();
      const lost1: Lost<void> = Lost.of<void>(error);
      const lost2: Lost<number> = Lost.of<number>(error);

      expect(lost1.isPresent()).toBe(false);
      expect(lost2.isPresent()).toBe(false);
    });
  });
  describe('isAbsent', () => {
    it('returns false', () => {
      const error: MockError = new MockError();
      const lost1: Lost<void> = Lost.of<void>(error);
      const lost2: Lost<number> = Lost.of<number>(error);

      expect(lost1.isAbsent()).toBe(false);
      expect(lost2.isAbsent()).toBe(false);
    });
  });

  describe('isLost', () => {
    it('returns true', () => {
      const error: MockError = new MockError();
      const lost1: Lost<void> = Lost.of<void>(error);
      const lost2: Lost<number> = Lost.of<number>(error);

      expect(lost1.isLost()).toBe(true);
      expect(lost2.isLost()).toBe(true);
    });
  });
});
