import { MockValueObject } from '../MockValueObject';

describe('MockValueObject', () => {
  describe('hashCode', () => {
    it('normal case', () => {
      expect(new MockValueObject().hashCode()).toBe(new MockValueObject().hashCode());
    });
  });
});
