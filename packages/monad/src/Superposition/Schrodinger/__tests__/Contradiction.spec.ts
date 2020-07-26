import { MockError } from '@jamashita/publikum-object';
import sinon, { SinonSpy } from 'sinon';

import { Alive } from '../Alive';
import { Contradiction } from '../Contradiction';
import { Dead } from '../Dead';
import { Schrodinger } from '../Schrodinger';
import { Still } from '../Still';

describe('Contradiction', () => {
  describe('get', () => {
    it('throws given error', () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const contradiction1: Contradiction<number, MockError> = Contradiction.of<number, MockError>(error1);
      const contradiction2: Contradiction<number, MockError> = Contradiction.of<number, MockError>(error2);

      expect(() => {
        contradiction1.get();
      }).toThrow(error1);
      expect(() => {
        contradiction2.get();
      }).toThrow(error2);
    });
  });

  describe('getCause', () => {
    it('returns given error', () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const contradiction1: Contradiction<number, MockError> = Contradiction.of<number, MockError>(error1);
      const contradiction2: Contradiction<number, MockError> = Contradiction.of<number, MockError>(error2);

      expect(contradiction1.getCause()).toBe(error1);
      expect(contradiction2.getCause()).toBe(error2);
    });
  });

  describe('isAlive', () => {
    it('always returns false', () => {
      const error: MockError = new MockError();
      const contradiction: Contradiction<number, MockError> = Contradiction.of<number, MockError>(error);

      expect(contradiction.isAlive()).toBe(false);
    });
  });

  describe('isDead', () => {
    it('always returns false', () => {
      const error: MockError = new MockError();
      const contradiction: Contradiction<number, MockError> = Contradiction.of<number, MockError>(error);

      expect(contradiction.isDead()).toBe(false);
    });
  });

  describe('isContradiction', () => {
    it('always returns true', () => {
      const error: MockError = new MockError();
      const contradiction: Contradiction<number, MockError> = Contradiction.of<number, MockError>(error);

      expect(contradiction.isContradiction()).toBe(true);
    });
  });

  describe('ifAlive', () => {
    it('will not be invoked', () => {
      const value: number = 1;

      const spy: SinonSpy = sinon.spy();

      const contradiction: Contradiction<number, MockError> = Contradiction.of<number, MockError>(value);

      contradiction.ifAlive(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('ifDead', () => {
    it('will not be invoked', () => {
      const value: number = 1;

      const spy: SinonSpy = sinon.spy();

      const contradiction: Contradiction<number, MockError> = Contradiction.of<number, MockError>(value);

      contradiction.ifDead(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('ifContradiction', () => {
    it('will be invoked', () => {
      const value: number = 1;

      const spy: SinonSpy = sinon.spy();

      const contradiction: Contradiction<number, MockError> = Contradiction.of<number, MockError>(value);

      contradiction.ifContradiction((v: unknown) => {
        spy();
        expect(v).toBe(value);
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('equals', () => {
    it('returns true if Contradiction given even if the cause is different', () => {
      const alive: Alive<number, MockError> = Alive.of<number, MockError>(2);
      const dead: Dead<number, MockError> = Dead.of<number, MockError>(new MockError());
      const contradiction: Contradiction<number, MockError> = Contradiction.of<number, MockError>(null);
      const still: Still<number, MockError> = Still.of<number, MockError>();

      const schrodinger: Schrodinger<number, MockError> = Contradiction.of<number, MockError>(undefined);

      expect(schrodinger.equals(schrodinger)).toBe(true);
      expect(schrodinger.equals(alive)).toBe(false);
      expect(schrodinger.equals(dead)).toBe(false);
      expect(schrodinger.equals(contradiction)).toBe(true);
      expect(schrodinger.equals(still)).toBe(false);
    });
  });
});
