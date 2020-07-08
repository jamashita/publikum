import { MockError } from '@jamashita/publikum-object';

import { DeadErrorDetective } from '../DeadErrorDetective';

describe('DeadErrorDetective', () => {
  describe('contains', () => {
    it('returns true if the very class is included', () => {
      const error: MockError = new MockError();

      expect(
        DeadErrorDetective.contains<Error>(error, [TypeError, SyntaxError, MockError])
      ).toBe(true);
    });

    it('returns false if the class is not included', () => {
      const error: MockError = new MockError();

      expect(
        DeadErrorDetective.contains<Error>(error, [TypeError, SyntaxError])
      ).toBe(false);
    });

    it('returns true if super class of the class is included', () => {
      const error: MockError = new MockError();

      expect(
        DeadErrorDetective.contains<Error>(error, [TypeError, SyntaxError, Error])
      ).toBe(true);
    });
  });
});
