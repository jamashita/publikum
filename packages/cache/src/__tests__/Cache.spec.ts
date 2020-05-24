import { Cache } from '../Cache';
import { CacheError } from '../Error/CacheError';

describe('Cache', () => {
  describe('get', () => {
    it('normal case', () => {
      const cache: Cache = new Cache();
      const identifier1: symbol = Symbol();
      const identifier2: symbol = Symbol();
      const identifier3: symbol = Symbol();
      const identifier4: symbol = Symbol();
      const identifier5: symbol = Symbol();
      const value1: number = 1;
      const value2: number = 0;
      const value3: number = 0.2;
      const value4: number = NaN;
      const value5: number = Infinity;

      cache.set(identifier1, value1);
      expect(cache.get<number>(identifier1)).toBe(value1);
      cache.set(identifier2, value2);
      expect(cache.get<number>(identifier2)).toBe(value2);
      cache.set(identifier3, value3);
      expect(cache.get<number>(identifier3)).toBe(value3);
      cache.set(identifier4, value4);
      expect(cache.get<number>(identifier4)).toBe(value4);
      cache.set(identifier5, value5);
      expect(cache.get<number>(identifier5)).toBe(value5);
    });

    it('only retains the last one', () => {
      const cache: Cache = new Cache();
      const identifier1: symbol = Symbol();
      const value1: number = 1;
      const value2: number = 0;

      cache.set(identifier1, value1);
      expect(cache.get<number>(identifier1)).toBe(value1);
      cache.set(identifier1, value2);
      expect(cache.get<number>(identifier1)).toBe(value2);
    });

    it('throws CacheError when value is not set', () => {
      const cache: Cache = new Cache();
      const identifier: symbol = Symbol();

      expect(() => {
        cache.get<number>(identifier);
      }).toThrow(CacheError);
    });
  });
});