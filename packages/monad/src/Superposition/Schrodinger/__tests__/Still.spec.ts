import { MockError } from '@jamashita/publikum-object';
import sinon, { SinonSpy } from 'sinon';
import { SuperpositionError } from '../../Error/SuperpositionError';
import { Alive } from '../Alive';
import { Contradiction } from '../Contradiction';
import { Dead } from '../Dead';
import { Schrodinger } from '../Schrodinger';
import { Still } from '../Still';

describe('Still', () => {
  describe('get', () => {
    it('throws the inside error', () => {
      expect.assertions(1);
      const still: Still<number, MockError> = Still.of<number, MockError>();

      expect(() => {
        still.get();
      }).toThrow(SuperpositionError);
    });
  });

  describe('isAlive', () => {
    it('always returns false', () => {
      expect.assertions(1);
      const still: Still<number, MockError> = Still.of<number, MockError>();

      expect(still.isAlive()).toBe(false);
    });
  });

  describe('isDead', () => {
    it('always returns false', () => {
      expect.assertions(1);
      const still: Still<number, MockError> = Still.of<number, MockError>();

      expect(still.isDead()).toBe(false);
    });
  });

  describe('isContradiction', () => {
    it('always returns false', () => {
      expect.assertions(1);
      const still: Still<number, MockError> = Still.of<number, MockError>();

      expect(still.isContradiction()).toBe(false);
    });
  });

  describe('ifAlive', () => {
    it('will not be invoked', () => {
      expect.assertions(1);
      const spy: SinonSpy = sinon.spy();

      const still: Still<number, MockError> = Still.of<number, MockError>();

      still.ifAlive(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('ifDead', () => {
    it('will not be invoked', () => {
      expect.assertions(1);
      const spy: SinonSpy = sinon.spy();

      const still: Still<number, MockError> = Still.of<number, MockError>();

      still.ifDead(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('ifContradiction', () => {
    it('will not be invoked', () => {
      expect.assertions(1);
      const spy: SinonSpy = sinon.spy();

      const still: Still<number, MockError> = Still.of<number, MockError>();

      still.ifContradiction(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true if Still given', () => {
      expect.assertions(5);
      const alive: Alive<number, MockError> = Alive.of<number, MockError>(2);
      const dead: Dead<number, MockError> = Dead.of<number, MockError>(new MockError());
      const contradiction: Contradiction<number, MockError> = Contradiction.of<number, MockError>(null);
      const still: Still<number, MockError> = Still.of<number, MockError>();

      const schrodinger: Schrodinger<number, MockError> = Still.of<number, MockError>();

      expect(schrodinger.equals(schrodinger)).toBe(true);
      expect(schrodinger.equals(alive)).toBe(false);
      expect(schrodinger.equals(dead)).toBe(false);
      expect(schrodinger.equals(contradiction)).toBe(false);
      expect(schrodinger.equals(still)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns Still', () => {
      expect.assertions(1);
      expect(Still.of<number, MockError>().toString()).toBe('Still');
    });
  });
});
