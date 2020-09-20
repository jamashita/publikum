import { MockValueObject } from '../Mock/MockValueObject';

describe('ValueObject', () => {
  describe('hashCode', () => {
    it('normal case', () => {
      expect.assertions(1);

      expect(new MockValueObject(true).hashCode()).toBe(new MockValueObject(true).hashCode());
    });
  });
});
