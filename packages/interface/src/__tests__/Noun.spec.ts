import { isNoun, Noun } from '../Noun';

class MockNoun implements Noun {
  public readonly noun: string = 'popo';
}

describe('Noun', () => {
  describe('isNoun', () => {
    it('normal case', () => {
      expect.assertions(15);

      expect(isNoun(null)).toBe(false);
      expect(isNoun(undefined)).toBe(false);
      expect(isNoun('')).toBe(false);
      expect(isNoun('123')).toBe(false);
      expect(isNoun('abcd')).toBe(false);
      expect(isNoun(123)).toBe(false);
      expect(isNoun(0)).toBe(false);
      expect(isNoun(false)).toBe(false);
      expect(isNoun(true)).toBe(false);
      expect(isNoun(Symbol())).toBe(false);
      expect(isNoun(20n)).toBe(false);
      expect(isNoun({})).toBe(false);
      expect(isNoun([])).toBe(false);
      expect(
        isNoun({
          noun: 'pipi'
        })
      ).toBe(true);
      expect(isNoun(new MockNoun())).toBe(true);
    });
  });
});
