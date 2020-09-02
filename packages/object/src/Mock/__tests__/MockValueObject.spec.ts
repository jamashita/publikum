import { MockValueObject } from '../MockValueObject';

describe('MockValueObject', () => {
  describe('hashCode', () => {
    it('normal case', () => {
      expect.assertions(1);
      expect(new MockValueObject(true).hashCode()).toBe(new MockValueObject(true).hashCode());
    });
  });
});
