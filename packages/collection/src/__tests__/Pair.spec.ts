import { Pair } from '..';

describe('Pair', () => {
  describe('equals', () => {
    it('returns only the same instance', () => {
      expect.assertions(3);

      const pair1: Pair<number, string> = Pair.of<number, string>(1, '1');
      const pair2: Pair<number, string> = Pair.of<number, string>(2, '2');
      const pair3: Pair<number, string> = Pair.of<number, string>(1, '1');

      expect(pair1.equals(pair1)).toBe(true);
      expect(pair1.equals(pair2)).toBe(false);
      expect(pair1.equals(pair3)).toBe(false);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      expect.assertions(1);

      const key: number = -4;
      const value: string = 'omelette';

      const pair: Pair<number, string> = Pair.of<number, string>(key, value);

      expect(pair.toString()).toBe('{-4: omelette}');
    });
  });
});
