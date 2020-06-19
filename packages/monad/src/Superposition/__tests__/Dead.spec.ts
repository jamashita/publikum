import { MockError } from '@jamashita/publikum-object';

import { QuantumError } from '../../Quantum/Error/QuantumError';
import { Dead } from '../Dead';

describe('Dead', () => {
  describe('of', () => {
    it('normal case', () => {
      const dead: Dead<number, MockError> = Dead.of<number, MockError>(new MockError());

      expect(() => {
        dead.get();
      }).toThrow(MockError);
    });
  });

  describe('get', () => {
    it('throws the inside error', () => {
      const dead: Dead<number, MockError> = Dead.of<number, MockError>(new MockError());

      expect(() => {
        dead.get();
      }).toThrow(MockError);
    });
  });

  describe('getError', () => {
    it('normal case', () => {
      const error: MockError = new MockError();
      const dead: Dead<number, MockError> = Dead.of<number, MockError>(error);

      expect(dead.getError()).toBe(error);
    });
  });

  describe('isAlive', () => {
    it('always returns false', () => {
      const dead1: Dead<number, MockError> = Dead.of<number, MockError>(new MockError());
      const dead2: Dead<number, MockError> = Dead.of<number, MockError>(new MockError());

      expect(dead1.isAlive()).toBe(false);
      expect(dead2.isAlive()).toBe(false);
    });
  });

  describe('isDead', () => {
    it('always returns true', () => {
      const dead1: Dead<number, MockError> = Dead.of<number, MockError>(new MockError());
      const dead2: Dead<number, MockError> = Dead.of<number, MockError>(new MockError());

      expect(dead1.isDead()).toBe(true);
      expect(dead2.isDead()).toBe(true);
    });
  });

  /*
   * describe('toQuantum', () => {
   *   it('returns Absent', () => {
   *     const dead: Dead<number, MockError> = Dead.of<number, MockError>(new MockError());
   *     expect(dead.toQuantum()).toBeInstanceOf(Absent);
   *   });
   * });
   */

  describe('transpose', () => {
    it('does nothing', () => {
      const dead: Dead<number, MockError> = Dead.of<number, MockError>(new MockError());

      expect(dead.transpose<QuantumError>()).toBe(dead);
    });
  });
});
