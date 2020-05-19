import sinon, { SinonSpy } from 'sinon';

import { MockError } from '../../Mock';
import { MySQLError } from '../../MySQL';
import { Present } from '../../Quantum/Present';
import { Alive } from '../Alive';

describe('Alive', () => {
  describe('of', () => {
    it('no argument call', () => {
      const alive: Alive<void, MockError> = Alive.of<MockError>();

      expect(alive.get()).toBe(undefined);
    });

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

  describe('match', () => {
    it('excuses alive block', () => {
      const value: number = 100;
      const alive: Alive<number, MockError> = Alive.of<number, MockError>(value);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const res: number = alive.match<number>(
        (n: number, s: Alive<number, MockError>) => {
          spy1();
          expect(n).toBe(value);
          expect(s).toBe(alive);
          return n * 2;
        },
        () => {
          spy2();
          return value ** 2;
        }
      );

      expect(res).toBe(value * 2);
      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });
  });

  describe('toQuantum', () => {
    it('returns Present', () => {
      const alive: Alive<number, MockError> = Alive.of<number, MockError>(100);

      expect(alive.toQuantum()).toBeInstanceOf(Present);
    });
  });

  describe('transpose', () => {
    it('does nothing', () => {
      const alive: Alive<number, MockError> = Alive.of<number, MockError>(100);

      expect(alive.transpose<MySQLError>()).toBe(alive);
    });
  });
});
