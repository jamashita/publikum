import { MockError } from '@jamashita/publikum-object';
import sinon, { SinonSpy } from 'sinon';
import { Absent } from '../Absent';
import { Heisenberg } from '../Heisenberg';

import { Lost } from '../Lost';
import { Present } from '../Present';
import { Uncertain } from '../Uncertain';

describe('Lost', () => {
  describe('get', () => {
    it('throws given error', () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const lost1: Lost<void> = Lost.of<void>(error1);
      const lost2: Lost<number> = Lost.of<number>(error2);

      expect(() => {
        lost1.get();
      }).toThrow(error1);
      expect(() => {
        lost2.get();
      }).toThrow(error2);
    });
  });

  describe('getCause', () => {
    it('returns given error', () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const lost1: Lost<void> = Lost.of<void>(error1);
      const lost2: Lost<number> = Lost.of<number>(error2);

      expect(lost1.getCause()).toBe(error1);
      expect(lost2.getCause()).toBe(error2);
    });
  });

  describe('isPresent', () => {
    it('returns false', () => {
      const error: MockError = new MockError();
      const lost: Lost<void> = Lost.of<void>(error);

      expect(lost.isPresent()).toBe(false);
    });
  });
  describe('isAbsent', () => {
    it('returns false', () => {
      const error: MockError = new MockError();
      const lost: Lost<void> = Lost.of<void>(error);

      expect(lost.isAbsent()).toBe(false);
    });
  });

  describe('isLost', () => {
    it('returns true', () => {
      const error: MockError = new MockError();
      const lost: Lost<void> = Lost.of<void>(error);

      expect(lost.isLost()).toBe(true);
    });
  });

  describe('ifPresent', () => {
    it('will not be invoked', () => {
      const error: MockError = new MockError();

      const spy: SinonSpy = sinon.spy();

      const lost: Lost<number> = Lost.of<number>(error);

      lost.ifPresent(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('ifAbsent', () => {
    it('will not be invoked', () => {
      const error: MockError = new MockError();

      const spy: SinonSpy = sinon.spy();

      const lost: Lost<number> = Lost.of<number>(error);

      lost.ifAbsent(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('ifLost', () => {
    it('will be invoked', () => {
      const error: MockError = new MockError();

      const spy: SinonSpy = sinon.spy();

      const lost: Lost<number> = Lost.of<number>(error);

      lost.ifLost(() => {
        spy();
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('equals', () => {
    it('returns true if Lost given even if the value is different', () => {
      const present: Present<number> = Present.of<number>(2);
      const absent: Absent<number> = Absent.of<number>();
      const lost: Lost<number> = Lost.of<number>(new MockError());
      const uncertain: Uncertain<number> = Uncertain.of<number>();

      const heisenberg: Heisenberg<number> = Lost.of<number>(new SyntaxError());

      expect(heisenberg.equals(heisenberg)).toBe(true);
      expect(heisenberg.equals(present)).toBe(false);
      expect(heisenberg.equals(absent)).toBe(false);
      expect(heisenberg.equals(lost)).toBe(true);
      expect(heisenberg.equals(uncertain)).toBe(false);
    });
  });
});
