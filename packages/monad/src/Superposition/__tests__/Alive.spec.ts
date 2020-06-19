import { MockError } from '@jamashita/publikum-object';

import { Alive } from '../Alive';

describe('Alive', () => {
  describe('of', () => {
    it('normal case', () => {
      const value: number = 113;
      const alive: Alive<number, MockError> = Alive.of<number, MockError>(value);

      expect(alive.get()).toBe(value);
    });
  });

  describe('get', () => {
    it('returns the inside value', () => {
      const value: string = 'the lazy fox';
      const alive: Alive<string, MockError> = Alive.of<string, MockError>(value);

      expect(alive.get()).toBe(value);
    });
  });

  describe('isAlive', () => {
    it('always returns true', () => {
      const value1: number = 1;
      const value2: string = 'aiutare';
      const alive1: Alive<number, MockError> = Alive.of<number, MockError>(value1);
      const alive2: Alive<string, MockError> = Alive.of<string, MockError>(value2);

      expect(alive1.isAlive()).toBe(true);
      expect(alive1.get()).toBe(value1);
      expect(alive2.isAlive()).toBe(true);
      expect(alive2.get()).toBe(value2);
    });
  });

  describe('isDead', () => {
    it('always returns false', () => {
      const alive1: Alive<number, MockError> = Alive.of<number, MockError>(1);
      const alive2: Alive<string, MockError> = Alive.of<string, MockError>('aiutare');

      expect(alive1.isDead()).toBe(false);
      expect(alive2.isDead()).toBe(false);
    });
  });

  /*
   * describe('toQuantum', () => {
   *   it('returns Present', () => {
   *     const alive: Alive<number, MockError> = Alive.of<number, MockError>(100);
   *     expect(alive.toQuantum()).toBeInstanceOf(Present);
   *   });
   * });
   */
});
