import { MockRuntimeError } from '@jamashita/publikum-error';
import { MockValueObject } from '@jamashita/publikum-object';
import sinon, { SinonSpy } from 'sinon';
import { SuperpositionError } from '../../Error/SuperpositionError';
import { Schrodinger } from '../Schrodinger';
import { Still } from '../Still';

describe('Still', () => {
  describe('get', () => {
    it('throws the inside error', () => {
      expect.assertions(1);

      const still: Still<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      expect(() => {
        still.get();
      }).toThrow(SuperpositionError);
    });
  });

  describe('isAlive', () => {
    it('always returns false', () => {
      expect.assertions(1);

      const still: Still<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      expect(still.isAlive()).toBe(false);
    });
  });

  describe('isDead', () => {
    it('always returns false', () => {
      expect.assertions(1);

      const still: Still<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      expect(still.isDead()).toBe(false);
    });
  });

  describe('isContradiction', () => {
    it('always returns false', () => {
      expect.assertions(1);

      const still: Still<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      expect(still.isContradiction()).toBe(false);
    });
  });

  describe('ifAlive', () => {
    it('will not be invoked', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();

      const still: Schrodinger<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

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

      const still: Schrodinger<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

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

      const still: Schrodinger<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      still.ifContradiction(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true if the same instance given', () => {
      expect.assertions(1);

      const schrodinger: Schrodinger<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      expect(schrodinger.equals(schrodinger)).toBe(true);
    });

    it('returns false if different class instance given', () => {
      expect.assertions(1);

      const schrodinger: Schrodinger<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      expect(schrodinger.equals(new MockValueObject('mock'))).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns Still', () => {
      expect.assertions(1);

      expect(Still.of<number, MockRuntimeError>().toString()).toBe('Still');
    });
  });
});
