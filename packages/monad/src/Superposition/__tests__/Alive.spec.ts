import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';

import { QuantumError } from '../../Quantum/Error/QuantumError';
import { Present } from '../../Quantum/Present';
import { Alive } from '../Alive';
import { Dead } from '../Dead';
import { SuperpositionError } from '../Error/SuperpositionError';
import { Superposition } from '../Superposition';

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

  describe('filter', () => {
    it('when predicate returns true, returns Alive', () => {
      const value: number = -1;
      const alive: Alive<number, MockError> = Alive.of<number, MockError>(value);

      const filtered: Superposition<number, MockError | SuperpositionError> = alive.filter(() => {
        return true;
      });

      expect(filtered.isAlive()).toBe(true);
      expect(filtered.get()).toBe(value);
    });

    it('when predicate returns false, reutrns Dead', () => {
      const value: number = -1;
      const alive: Alive<number, MockError> = Alive.of<number, MockError>(value);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const filtered: Superposition<number, MockError | SuperpositionError> = alive.filter(() => {
        return false;
      });

      expect(filtered.isDead()).toBe(true);
      filtered.transform<void>(
        () => {
          spy1();
        },
        (err: MockError | SuperpositionError) => {
          spy2();
          expect(err).toBeInstanceOf(SuperpositionError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
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

  describe('map', () => {
    it('normal pattern', () => {
      const uno: number = 1;
      const alive: Alive<number, MockError> = Alive.of<number, MockError>(uno);

      const spy: SinonSpy = sinon.spy();

      const superposition: Superposition<number | string, MockError> = alive.map<string, MockError>((n: number) => {
        spy();

        return `${n}${n}`;
      });

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get()).toBe('11');

      expect(spy.called).toBe(true);
    });

    it('throws error', () => {
      const uno: number = 1;
      const alive: Alive<number, MockError> = Alive.of<number, MockError>(uno);

      const spy: SinonSpy = sinon.spy();

      const superposition: Superposition<number | string, MockError> = alive.map<string, MockError>(() => {
        spy();

        throw new MockError();
      });

      expect(superposition.isDead()).toBe(true);

      expect(spy.called).toBe(true);
    });

    it('returns alive itself', () => {
      const uno: number = 1;
      const alive: Alive<number, MockError> = Alive.of<number, MockError>(uno);
      const newAlive: Alive<void, MockError> = Alive.of<MockError>();

      const spy: SinonSpy = sinon.spy();

      const superposition: Superposition<number | void, MockError> = alive.map<void, MockError>(() => {
        spy();

        return newAlive;
      });

      expect(superposition.isAlive()).toBe(true);
      expect(superposition).toBe(newAlive);

      expect(spy.called).toBe(true);
    });

    it('returns dead itself', () => {
      const uno: number = 1;
      const error: MockError = new MockError();
      const alive: Alive<number, MockError> = Alive.of<number, MockError>(uno);
      const dead: Dead<number, MockError> = Dead.of<number, MockError>(error);

      const spy: SinonSpy = sinon.spy();

      const superposition: Superposition<number, MockError> = alive.map<number, MockError>(() => {
        spy();

        return dead;
      });

      expect(superposition.isDead()).toBe(true);
      expect(superposition).toBe(dead);

      expect(spy.called).toBe(true);
    });
  });

  describe('recover', () => {
    it('returns itself', () => {
      const uno: number = 1;
      const alive: Alive<number, MockError> = Alive.of<number, MockError>(uno);

      const spy: SinonSpy = sinon.spy();

      const superposition: Superposition<number | void, MockError> = alive.recover<void, MockError>(() => {
        spy();
      });

      expect(alive).toBe(superposition);

      expect(spy.called).toBe(false);
    });
  });

  describe('transform', () => {
    it('excuses alive block', () => {
      const value: number = 100;
      const alive: Alive<number, MockError> = Alive.of<number, MockError>(value);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const res: number = alive.transform<number>(
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

      expect(alive.transpose<QuantumError>()).toBe(alive);
    });
  });
});
