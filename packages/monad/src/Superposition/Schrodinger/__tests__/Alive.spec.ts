import { MockRuntimeError } from '@jamashita/publikum-error';
import { MockValueObject } from '@jamashita/publikum-object';
import sinon, { SinonSpy } from 'sinon';
import { Alive } from '../Alive';
import { Contradiction } from '../Contradiction';
import { Dead } from '../Dead';
import { Schrodinger } from '../Schrodinger';
import { Still } from '../Still';

describe('Alive', () => {
  describe('get', () => {
    it('returns the inner value', () => {
      expect.assertions(7);

      const alive1: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(1);
      const alive2: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(0);
      const alive3: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(-1);
      const alive4: Alive<string, MockRuntimeError> = Alive.of<string, MockRuntimeError>('');
      const alive5: Alive<string, MockRuntimeError> = Alive.of<string, MockRuntimeError>('1');
      const alive6: Alive<boolean, MockRuntimeError> = Alive.of<boolean, MockRuntimeError>(true);
      const alive7: Alive<boolean, MockRuntimeError> = Alive.of<boolean, MockRuntimeError>(false);

      expect(alive1.get()).toBe(1);
      expect(alive2.get()).toBe(0);
      expect(alive3.get()).toBe(-1);
      expect(alive4.get()).toBe('');
      expect(alive5.get()).toBe('1');
      expect(alive6.get()).toBe(true);
      expect(alive7.get()).toBe(false);
    });
  });

  describe('isAlive', () => {
    it('always returns true', () => {
      expect.assertions(7);

      const alive1: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(1);
      const alive2: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(0);
      const alive3: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(-1);
      const alive4: Alive<string, MockRuntimeError> = Alive.of<string, MockRuntimeError>('');
      const alive5: Alive<string, MockRuntimeError> = Alive.of<string, MockRuntimeError>('1');
      const alive6: Alive<boolean, MockRuntimeError> = Alive.of<boolean, MockRuntimeError>(true);
      const alive7: Alive<boolean, MockRuntimeError> = Alive.of<boolean, MockRuntimeError>(false);

      expect(alive1.isAlive()).toBe(true);
      expect(alive2.isAlive()).toBe(true);
      expect(alive3.isAlive()).toBe(true);
      expect(alive4.isAlive()).toBe(true);
      expect(alive5.isAlive()).toBe(true);
      expect(alive6.isAlive()).toBe(true);
      expect(alive7.isAlive()).toBe(true);
    });
  });

  describe('isDead', () => {
    it('always returns false', () => {
      expect.assertions(7);

      const alive1: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(1);
      const alive2: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(0);
      const alive3: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(-1);
      const alive4: Alive<string, MockRuntimeError> = Alive.of<string, MockRuntimeError>('');
      const alive5: Alive<string, MockRuntimeError> = Alive.of<string, MockRuntimeError>('1');
      const alive6: Alive<boolean, MockRuntimeError> = Alive.of<boolean, MockRuntimeError>(true);
      const alive7: Alive<boolean, MockRuntimeError> = Alive.of<boolean, MockRuntimeError>(false);

      expect(alive1.isDead()).toBe(false);
      expect(alive2.isDead()).toBe(false);
      expect(alive3.isDead()).toBe(false);
      expect(alive4.isDead()).toBe(false);
      expect(alive5.isDead()).toBe(false);
      expect(alive6.isDead()).toBe(false);
      expect(alive7.isDead()).toBe(false);
    });
  });

  describe('isContradiction', () => {
    it('always returns false', () => {
      expect.assertions(7);

      const alive1: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(1);
      const alive2: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(0);
      const alive3: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(-1);
      const alive4: Alive<string, MockRuntimeError> = Alive.of<string, MockRuntimeError>('');
      const alive5: Alive<string, MockRuntimeError> = Alive.of<string, MockRuntimeError>('1');
      const alive6: Alive<boolean, MockRuntimeError> = Alive.of<boolean, MockRuntimeError>(true);
      const alive7: Alive<boolean, MockRuntimeError> = Alive.of<boolean, MockRuntimeError>(false);

      expect(alive1.isContradiction()).toBe(false);
      expect(alive2.isContradiction()).toBe(false);
      expect(alive3.isContradiction()).toBe(false);
      expect(alive4.isContradiction()).toBe(false);
      expect(alive5.isContradiction()).toBe(false);
      expect(alive6.isContradiction()).toBe(false);
      expect(alive7.isContradiction()).toBe(false);
    });
  });

  describe('ifAlive', () => {
    it('will be invoked', () => {
      expect.assertions(2);

      const value: number = 1;

      const spy: SinonSpy = sinon.spy();

      const alive: Schrodinger<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(value);

      alive.ifAlive((v: number) => {
        spy();
        expect(v).toBe(value);
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('ifDead', () => {
    it('will not be invoked', () => {
      expect.assertions(1);

      const value: number = 1;

      const spy: SinonSpy = sinon.spy();

      const alive: Schrodinger<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(value);

      alive.ifDead(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('ifContradiction', () => {
    it('will not be invoked', () => {
      expect.assertions(1);

      const value: number = 1;

      const spy: SinonSpy = sinon.spy();

      const alive: Schrodinger<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(value);

      alive.ifContradiction(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true if the same instance given', () => {
      expect.assertions(1);

      const schrodinger: Schrodinger<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(2);

      expect(schrodinger.equals(schrodinger)).toBe(true);
    });

    it('returns false if the different class instance given', () => {
      expect.assertions(1);

      const schrodinger: Schrodinger<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(2);

      expect(schrodinger.equals(new MockValueObject('mock'))).toBe(false);
    });

    it('returns true if the same value Alive given', () => {
      expect.assertions(5);

      const alive1: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(2);
      const alive2: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(3);
      const dead: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new MockRuntimeError());
      const contradiction: Contradiction<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(null);
      const still: Still<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      const schrodinger: Schrodinger<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(2);

      expect(schrodinger.equals(alive1)).toBe(true);
      expect(schrodinger.equals(alive2)).toBe(false);
      expect(schrodinger.equals(dead)).toBe(false);
      expect(schrodinger.equals(contradiction)).toBe(false);
      expect(schrodinger.equals(still)).toBe(false);
    });

    it('returns true if the same Equalable instance given', () => {
      expect.assertions(2);

      const alive1: Alive<MockValueObject<boolean>, MockRuntimeError> = Alive.of<MockValueObject<boolean>, MockRuntimeError>(new MockValueObject<boolean>(true));
      const alive2: Alive<MockValueObject<boolean>, MockRuntimeError> = Alive.of<MockValueObject<boolean>, MockRuntimeError>(new MockValueObject<boolean>(false));

      const schrodinger: Schrodinger<MockValueObject<boolean>, MockRuntimeError> = Alive.of<MockValueObject<boolean>, MockRuntimeError>(new MockValueObject<boolean>(true));

      expect(schrodinger.equals(alive1)).toBe(true);
      expect(schrodinger.equals(alive2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns Alive and its retaining value', () => {
      expect.assertions(1);

      expect(Alive.of<boolean, MockRuntimeError>(true).toString()).toBe('Alive: true');
    });
  });
});
