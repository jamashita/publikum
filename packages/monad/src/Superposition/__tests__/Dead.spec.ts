import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';

import { Absent } from '../../Quantum/Absent';
import { QuantumError } from '../../Quantum/Error/QuantumError';
import { Alive } from '../Alive';
import { Dead } from '../Dead';
import { SuperpositionError } from '../Error/SuperpositionError';
import { Superposition } from '../Superposition';

describe('Dead', () => {
  describe('of', () => {
    it('one generic call', () => {
      const dead: Dead<void, MockError> = Dead.of<MockError>(new MockError());

      expect(() => {
        dead.get();
      }).toThrow(MockError);
    });

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

  describe('filter', () => {
    it('is not going to be executed', () => {
      const error: MockError = new MockError();
      const dead: Dead<number, MockError> = Dead.of<number, MockError>(error);

      const spy: SinonSpy = sinon.spy();

      const filtered: Superposition<number, MockError | SuperpositionError> = dead.filter(() => {
        spy();

        return true;
      });

      expect(filtered.isDead()).toBe(true);

      expect(spy.called).toBe(false);
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

  describe('map', () => {
    it('returns itself', () => {
      const error: MockError = new MockError();
      const dead: Dead<number, MockError> = Dead.of<number, MockError>(error);

      const spy: SinonSpy = sinon.spy();

      const superposition: Superposition<void, MockError> = dead.map<void, MockError>(() => {
        spy();
      });

      expect(dead).toBe(superposition);

      expect(spy.called).toBe(false);
    });
  });

  describe('recover', () => {
    it('normal pattern', () => {
      const error: MockError = new MockError();
      const uno: string = 'uno';
      const dead: Dead<number, MockError> = Dead.of<number, MockError>(error);

      const spy: SinonSpy = sinon.spy();

      const superposition: Superposition<number | string, MockError> = dead.recover<string, MockError>(() => {
        spy();

        return uno;
      });

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get()).toBe(uno);

      expect(spy.called).toBe(true);
    });

    it('throws error', () => {
      const error: MockError = new MockError();
      const dead: Dead<number, MockError> = Dead.of<number, MockError>(error);

      const spy: SinonSpy = sinon.spy();

      const superposition: Superposition<number | string, MockError> = dead.recover<string, MockError>(() => {
        spy();

        throw new MockError();
      });

      expect(superposition.isDead()).toBe(true);

      expect(spy.called).toBe(true);
    });

    it('returns alive itself', () => {
      const error: MockError = new MockError();
      const dead: Dead<number, MockError> = Dead.of<number, MockError>(error);
      const alive: Alive<void, MockError> = Alive.of<MockError>();

      const spy: SinonSpy = sinon.spy();

      const superposition: Superposition<number | void, MockError> = dead.recover<void, MockError>(() => {
        spy();

        return alive;
      });

      expect(superposition.isAlive()).toBe(true);
      expect(superposition).toBe(alive);

      expect(spy.called).toBe(true);
    });

    it('returns dead itself', () => {
      const error: MockError = new MockError();
      const dead: Dead<number, MockError> = Dead.of<number, MockError>(error);
      const newDead: Dead<void, MockError> = Dead.of<MockError>(error);

      const spy: SinonSpy = sinon.spy();

      const superposition: Superposition<number | void, MockError> = dead.recover<void, MockError>(() => {
        spy();

        return newDead;
      });

      expect(superposition.isDead()).toBe(true);

      expect(spy.called).toBe(true);
    });
  });

  describe('transform', () => {
    it('excuses dead block', () => {
      const error: MockError = new MockError();
      const value: number = 1234;
      const dead: Dead<number, MockError> = Dead.of<number, MockError>(error);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const res: number = dead.transform<number>(
        (n: number) => {
          spy1();

          return n;
        },
        (err: MockError, f: Dead<number, MockError>) => {
          spy2();
          expect(err).toBe(error);
          expect(f).toBe(dead);

          return value * 2;
        }
      );

      expect(res).toBe(value * 2);
      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('toQuantum', () => {
    it('returns Absent', () => {
      const dead: Dead<number, MockError> = Dead.of<number, MockError>(new MockError());

      expect(dead.toQuantum()).toBeInstanceOf(Absent);
    });
  });

  describe('transpose', () => {
    it('does nothing', () => {
      const dead: Dead<number, MockError> = Dead.of<number, MockError>(new MockError());

      expect(dead.transpose<QuantumError>()).toBe(dead);
    });
  });
});
