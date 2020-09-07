import { MockRuntimeError } from '@jamashita/publikum-error';
import sinon, { SinonSpy } from 'sinon';
import { Alive } from '../Alive';
import { Contradiction } from '../Contradiction';
import { Dead } from '../Dead';
import { Schrodinger } from '../Schrodinger';
import { Still } from '../Still';

describe('Dead', () => {
  describe('get', () => {
    it('throws the inside error', () => {
      expect.assertions(1);
      const dead: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new MockRuntimeError());

      expect(() => {
        dead.get();
      }).toThrow(MockRuntimeError);
    });
  });

  describe('getError', () => {
    it('normal case', () => {
      expect.assertions(1);
      const error: MockRuntimeError = new MockRuntimeError();
      const dead: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(error);

      expect(dead.getError()).toBe(error);
    });
  });

  describe('isAlive', () => {
    it('always returns false', () => {
      expect.assertions(2);
      const dead1: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new MockRuntimeError());
      const dead2: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new MockRuntimeError());

      expect(dead1.isAlive()).toBe(false);
      expect(dead2.isAlive()).toBe(false);
    });
  });

  describe('isDead', () => {
    it('always returns true', () => {
      expect.assertions(2);
      const dead1: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new MockRuntimeError());
      const dead2: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new MockRuntimeError());

      expect(dead1.isDead()).toBe(true);
      expect(dead2.isDead()).toBe(true);
    });
  });

  describe('isContradiction', () => {
    it('always returns false', () => {
      expect.assertions(2);
      const dead1: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new MockRuntimeError());
      const dead2: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new MockRuntimeError());

      expect(dead1.isContradiction()).toBe(false);
      expect(dead2.isContradiction()).toBe(false);
    });
  });

  describe('ifAlive', () => {
    it('will not be invoked', () => {
      expect.assertions(1);
      const error: MockRuntimeError = new MockRuntimeError();

      const spy: SinonSpy = sinon.spy();

      const dead: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(error);

      // @ts-expect-error
      dead.ifAlive(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('ifDead', () => {
    it('will be invoked', () => {
      expect.assertions(2);
      const error: MockRuntimeError = new MockRuntimeError();

      const spy: SinonSpy = sinon.spy();

      const dead: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(error);

      dead.ifDead((e: MockRuntimeError) => {
        spy();
        expect(e).toBe(error);
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('ifContradiction', () => {
    it('will not be invoked', () => {
      expect.assertions(1);
      const error: MockRuntimeError = new MockRuntimeError();

      const spy: SinonSpy = sinon.spy();

      const dead: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(error);

      // @ts-expect-error
      dead.ifContradiction(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true if Dead given even if the save error given', () => {
      expect.assertions(6);
      const error: MockRuntimeError = new MockRuntimeError();

      const alive: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(2);
      const dead1: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(error);
      const dead2: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new MockRuntimeError());
      const contradiction: Contradiction<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(null);
      const still: Still<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      const schrodinger: Schrodinger<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new MockRuntimeError());

      expect(schrodinger.equals(schrodinger)).toBe(true);
      expect(schrodinger.equals(alive)).toBe(false);
      expect(schrodinger.equals(dead1)).toBe(true);
      expect(schrodinger.equals(dead2)).toBe(true);
      expect(schrodinger.equals(contradiction)).toBe(false);
      expect(schrodinger.equals(still)).toBe(false);
    });

    it('returns false if the different error given', () => {
      expect.assertions(3);
      const dead1: Dead<number, Error> = Dead.of<number, Error>(new SyntaxError());
      const dead2: Dead<number, Error> = Dead.of<number, Error>(new MockRuntimeError());

      const schrodinger: Schrodinger<number, Error> = Dead.of<number, Error>(new MockRuntimeError());

      expect(schrodinger.equals(schrodinger)).toBe(true);
      expect(schrodinger.equals(dead1)).toBe(false);
      expect(schrodinger.equals(dead2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns Dead and its retaining error', () => {
      expect.assertions(1);
      expect(Dead.of<number, Error>(new MockRuntimeError()).toString()).toBe('Dead: MockRuntimeError: failed');
    });
  });
});
