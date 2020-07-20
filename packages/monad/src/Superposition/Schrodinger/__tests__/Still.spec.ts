import { MockError } from '@jamashita/publikum-object';
import sinon, { SinonSpy } from 'sinon';

import { SuperpositionError } from '../../Error/SuperpositionError';
import { Still } from '../Still';

describe('Still', () => {
  describe('get', () => {
    it('throws the inside error', () => {
      const still: Still<number, MockError> = Still.of<number, MockError>();

      expect(() => {
        still.get();
      }).toThrow(SuperpositionError);
    });
  });

  describe('isAlive', () => {
    it('always returns false', () => {
      const still: Still<number, MockError> = Still.of<number, MockError>();

      expect(still.isAlive()).toBe(false);
    });
  });

  describe('isDead', () => {
    it('always returns false', () => {
      const still: Still<number, MockError> = Still.of<number, MockError>();

      expect(still.isDead()).toBe(false);
    });
  });

  describe('isContradiction', () => {
    it('always returns false', () => {
      const still: Still<number, MockError> = Still.of<number, MockError>();

      expect(still.isContradiction()).toBe(false);
    });
  });

  describe('ifAlive', () => {
    it('will not be invoked', () => {
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
      const spy: SinonSpy = sinon.spy();

      const still: Still<number, MockError> = Still.of<number, MockError>();

      still.ifContradiction(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });
});
