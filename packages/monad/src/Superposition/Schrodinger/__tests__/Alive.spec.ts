import { Equalable } from '@jamashita/publikum-interface';
import { MockError } from '@jamashita/publikum-object';
import sinon, { SinonSpy } from 'sinon';

import { Alive } from '../Alive';
import { Contradiction } from '../Contradiction';
import { Dead } from '../Dead';
import { Schrodinger } from '../Schrodinger';
import { Still } from '../Still';

class TestEqualable implements Equalable<TestEqualable> {
  private readonly eq: boolean;

  public constructor(eq: boolean) {
    this.eq = eq;
  }

  public equals(other: TestEqualable): boolean {
    return this.eq === other.eq;
  }
}

describe('Alive', () => {
  describe('get', () => {
    it('returns the inside value', () => {
      const value: string = 'the lazy fox';
      const alive: Alive<string, MockError> = Alive.of<string, MockError>(value);

      expect(alive.get()).toBe(value);
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

  describe('isContradiction', () => {
    it('always returns false', () => {
      const alive1: Alive<number, MockError> = Alive.of<number, MockError>(1);
      const alive2: Alive<string, MockError> = Alive.of<string, MockError>('aiutare');

      expect(alive1.isContradiction()).toBe(false);
      expect(alive2.isContradiction()).toBe(false);
    });
  });

  describe('ifAlive', () => {
    it('will be invoked', () => {
      const value: number = 1;

      const spy: SinonSpy = sinon.spy();

      const alive: Alive<number, MockError> = Alive.of<number, MockError>(value);

      alive.ifAlive((v: number) => {
        spy();
        expect(v).toBe(value);
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('ifDead', () => {
    it('will not be invoked', () => {
      const value: number = 1;

      const spy: SinonSpy = sinon.spy();

      const alive: Alive<number, MockError> = Alive.of<number, MockError>(value);

      alive.ifDead(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('ifContradiction', () => {
    it('will not be invoked', () => {
      const value: number = 1;

      const spy: SinonSpy = sinon.spy();

      const alive: Alive<number, MockError> = Alive.of<number, MockError>(value);

      alive.ifContradiction(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true if the same value Alive given', () => {
      const alive1: Alive<number, MockError> = Alive.of<number, MockError>(2);
      const alive2: Alive<number, MockError> = Alive.of<number, MockError>(3);
      const dead: Dead<number, MockError> = Dead.of<number, MockError>(new MockError());
      const contradiction: Contradiction<number, MockError> = Contradiction.of<number, MockError>(null);
      const still: Still<number, MockError> = Still.of<number, MockError>();

      const schrodinger: Schrodinger<number, MockError> = Alive.of<number, MockError>(2);

      expect(schrodinger.equals(schrodinger)).toBe(true);
      expect(schrodinger.equals(alive1)).toBe(true);
      expect(schrodinger.equals(alive2)).toBe(false);
      expect(schrodinger.equals(dead)).toBe(false);
      expect(schrodinger.equals(contradiction)).toBe(false);
      expect(schrodinger.equals(still)).toBe(false);
    });

    it('returns true if the same Equalable instance Alive given', () => {
      const alive1: Alive<TestEqualable, MockError> = Alive.of<TestEqualable, MockError>(new TestEqualable(true));
      const alive2: Alive<TestEqualable, MockError> = Alive.of<TestEqualable, MockError>(new TestEqualable(false));

      const schrodinger: Schrodinger<TestEqualable, MockError> = Alive.of<TestEqualable, MockError>(new TestEqualable(true));

      expect(schrodinger.equals(schrodinger)).toBe(true);
      expect(schrodinger.equals(alive1)).toBe(true);
      expect(schrodinger.equals(alive2)).toBe(false);
    });
  });
});
