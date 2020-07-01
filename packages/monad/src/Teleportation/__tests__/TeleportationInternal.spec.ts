import { MockError } from '@jamashita/publikum-object';

import { Epoque } from '../../Epoque/Interface/Epoque';
import { Bennett } from '../Bennett/Bennett';
import { TeleportationInternal } from '../TeleportationInternal';

describe('TeleportationInternal', () => {
  describe('get', () => {
    it('returns inner value', async () => {
      const value: number = 14;

      const teleportation1: TeleportationInternal<number> = TeleportationInternal.of<number>(
        (epoque: Epoque<number, Error>) => {
          epoque.resolve(value);
        }
      );

      await expect(teleportation1.get()).resolves.toBe(value);
    });

    it('throws inner error', async () => {
      const error: MockError = new MockError();

      const teleportation1: TeleportationInternal<number> = TeleportationInternal.of<number>(
        (epoque: Epoque<number, Error>) => {
          epoque.reject(error);
        }
      );

      await expect(teleportation1.get()).rejects.toBe(error);
    });
  });

  describe('terminate', () => {
    it('returns Bennett subclass instance', async () => {
      const value: number = 14;
      const error: MockError = new MockError();

      const received: Bennett<number> = await TeleportationInternal.of<number>((epoque: Epoque<number, Error>) => {
        epoque.resolve(value);
      }).terminate();
      const disappeared: Bennett<number> = await TeleportationInternal.of<number>((epoque: Epoque<number, Error>) => {
        epoque.reject(error);
      }).terminate();

      expect(received.isReceived()).toBe(true);
      expect(received.get()).toBe(value);
      expect(disappeared.isDisappeared()).toBe(true);
      expect(() => {
        disappeared.get();
      }).toThrow(MockError);
    });
  });
});
