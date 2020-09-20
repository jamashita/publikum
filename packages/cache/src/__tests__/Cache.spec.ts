import { Resolve } from '@jamashita/publikum-type';
import { Cache } from '../Cache';
import { CacheError } from '../Error/CacheError';

const wait = (timeout: number): Promise<void> => {
  return new Promise<void>((resolve: Resolve<void>) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
};

describe('Cache', () => {
  describe('get', () => {
    it('normal case', () => {
      expect.assertions(5);

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

    it('timeout: timeout 0 is not going to be volate', async () => {
      expect.assertions(2);

      const cache: Cache = new Cache(0);
      const identifier: symbol = Symbol();
      const value: string = 'pppp';

      cache.set(identifier, value);
      expect(cache.get<string>(identifier)).toBe(value);

      await wait(3000);

      expect(cache.get<string>(identifier)).toBe(value);
    });

    it('timeout: timeout negative value is not going to be volate', async () => {
      expect.assertions(2);

      const cache: Cache = new Cache(-193);
      const identifier: symbol = Symbol();
      const value: string = 'pppp';

      cache.set(identifier, value);
      expect(cache.get<string>(identifier)).toBe(value);

      await wait(3000);

      expect(cache.get<string>(identifier)).toBe(value);
    });

    it('timeout: perform volatilization', async () => {
      expect.assertions(2);

      const cache: Cache = new Cache(1);
      const identifier: symbol = Symbol();
      const value: string = 'pppp';

      cache.set(identifier, value);
      expect(cache.get<string>(identifier)).toBe(value);

      await wait(3000);

      expect(() => {
        cache.get<string>(identifier);
      }).toThrow(CacheError);
    });

    it('timeout: update timeout', async () => {
      expect.assertions(2);

      const cache: Cache = new Cache(3);
      const identifier: symbol = Symbol();
      const value1: string = 'pppp';
      const value2: string = 'qqqq';

      cache.set(identifier, value1);

      await wait(2000);

      expect(cache.get<string>(identifier)).toBe(value1);
      cache.set(identifier, value2);

      await wait(2000);

      expect(cache.get<string>(identifier)).toBe(value2);
    });

    it('only retains the last one', () => {
      expect.assertions(2);

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
      expect.assertions(1);

      const cache: Cache = new Cache();
      const identifier: symbol = Symbol();

      expect(() => {
        cache.get<number>(identifier);
      }).toThrow(CacheError);
    });
  });
});
