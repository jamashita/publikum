import { Random } from '../Random';

describe('Random', () => {
  describe('string', () => {
    it('length is fixed', () => {
      expect.assertions(10000);
      const length: number = 10;

      for (let i: number = 0; i < 10000; i++) {
        expect(Random.string(length)).toHaveLength(length);
      }
    });
  });

  describe('integer', () => {
    it('value is over min and under max', () => {
      expect.assertions(20000);
      const min: number = 0;
      const max: number = 100;

      for (let i: number = 0; i < 10000; i++) {
        const value: number = Random.integer(min, max);

        expect(value <= max).toBe(true);
        expect(min <= value).toBe(true);
      }
    });
  });
});
