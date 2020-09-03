import { MockError } from '@jamashita/publikum-object';
import sinon, { SinonSpy } from 'sinon';
import { UnscharferelationError } from '../../Error/UnscharferelationError';
import { Absent } from '../Absent';
import { Heisenberg } from '../Heisenberg';
import { Lost } from '../Lost';
import { Present } from '../Present';
import { Uncertain } from '../Uncertain';

describe('Uncertain', () => {
  describe('get', () => {
    it('throws UnscharferelationError', () => {
      expect.assertions(2);
      const uncertain1: Uncertain<void> = Uncertain.of<void>();
      const uncertain2: Uncertain<number> = Uncertain.of<number>();

      expect(() => {
        uncertain1.get();
      }).toThrow(UnscharferelationError);
      expect(() => {
        uncertain2.get();
      }).toThrow(UnscharferelationError);
    });
  });

  describe('isPresent', () => {
    it('returns false', () => {
      expect.assertions(2);
      const uncertain1: Uncertain<void> = Uncertain.of<void>();
      const uncertain2: Uncertain<number> = Uncertain.of<number>();

      expect(uncertain1.isPresent()).toBe(false);
      expect(uncertain2.isPresent()).toBe(false);
    });
  });

  describe('isAbsent', () => {
    it('returns false', () => {
      expect.assertions(2);
      const uncertain1: Uncertain<void> = Uncertain.of<void>();
      const uncertain2: Uncertain<number> = Uncertain.of<number>();

      expect(uncertain1.isAbsent()).toBe(false);
      expect(uncertain2.isAbsent()).toBe(false);
    });
  });

  describe('isLost', () => {
    it('returns false', () => {
      expect.assertions(2);
      const uncertain1: Uncertain<void> = Uncertain.of<void>();
      const uncertain2: Uncertain<number> = Uncertain.of<number>();

      expect(uncertain1.isLost()).toBe(false);
      expect(uncertain2.isLost()).toBe(false);
    });
  });

  describe('ifPresent', () => {
    it('will not be invoked', () => {
      expect.assertions(1);
      const spy: SinonSpy = sinon.spy();

      const uncertain: Uncertain<number> = Uncertain.of<number>();

      uncertain.ifPresent(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('ifAbsent', () => {
    it('will not be invoked', () => {
      expect.assertions(1);
      const spy: SinonSpy = sinon.spy();

      const uncertain: Uncertain<number> = Uncertain.of<number>();

      uncertain.ifAbsent(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('ifLost', () => {
    it('will not be invoked', () => {
      expect.assertions(1);
      const spy: SinonSpy = sinon.spy();

      const uncertain: Uncertain<number> = Uncertain.of<number>();

      uncertain.ifLost(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true if Uncertain given', () => {
      expect.assertions(5);
      const present: Present<number> = Present.of<number>(2);
      const absent: Absent<number> = Absent.of<number>();
      const lost: Lost<number> = Lost.of<number>(new MockError());
      const uncertain: Uncertain<number> = Uncertain.of<number>();

      const heisenberg: Heisenberg<number> = Uncertain.of<number>();

      expect(heisenberg.equals(heisenberg)).toBe(true);
      expect(heisenberg.equals(present)).toBe(false);
      expect(heisenberg.equals(absent)).toBe(false);
      expect(heisenberg.equals(lost)).toBe(false);
      expect(heisenberg.equals(uncertain)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns Uncertain', () => {
      expect.assertions(1);
      expect(Uncertain.of<number>().toString()).toBe('Uncertain');
    });
  });
});
