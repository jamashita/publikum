import { MockRuntimeError } from '@jamashita/publikum-error';
import { Equalable } from '@jamashita/publikum-interface';
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
      expect.assertions(1);
      const value: string = 'the lazy fox';
      const alive: Alive<string, MockRuntimeError> = Alive.of<string, MockRuntimeError>(value);

      expect(alive.get()).toBe(value);
    });
  });

  describe('isAlive', () => {
    it('always returns true', () => {
      expect.assertions(4);
      const value1: number = 1;
      const value2: string = 'aiutare';
      const alive1: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(value1);
      const alive2: Alive<string, MockRuntimeError> = Alive.of<string, MockRuntimeError>(value2);

      expect(alive1.isAlive()).toBe(true);
      expect(alive1.get()).toBe(value1);
      expect(alive2.isAlive()).toBe(true);
      expect(alive2.get()).toBe(value2);
    });
  });

  describe('isDead', () => {
    it('always returns false', () => {
      expect.assertions(2);
      const alive1: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(1);
      const alive2: Alive<string, MockRuntimeError> = Alive.of<string, MockRuntimeError>('aiutare');

      expect(alive1.isDead()).toBe(false);
      expect(alive2.isDead()).toBe(false);
    });
  });

  describe('isContradiction', () => {
    it('always returns false', () => {
      expect.assertions(2);
      const alive1: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(1);
      const alive2: Alive<string, MockRuntimeError> = Alive.of<string, MockRuntimeError>('aiutare');

      expect(alive1.isContradiction()).toBe(false);
      expect(alive2.isContradiction()).toBe(false);
    });
  });

  describe('ifAlive', () => {
    it('will be invoked', () => {
      expect.assertions(2);
      const value: number = 1;

      const spy: SinonSpy = sinon.spy();

      const alive: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(value);

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

      const alive: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(value);

      // @ts-expect-error
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

      const alive: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(value);

      // @ts-expect-error
      alive.ifContradiction(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true if the same value Alive given', () => {
      expect.assertions(6);
      const alive1: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(2);
      const alive2: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(3);
      const dead: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(new MockRuntimeError());
      const contradiction: Contradiction<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(null);
      const still: Still<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      const schrodinger: Schrodinger<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(2);

      expect(schrodinger.equals(schrodinger)).toBe(true);
      expect(schrodinger.equals(alive1)).toBe(true);
      expect(schrodinger.equals(alive2)).toBe(false);
      expect(schrodinger.equals(dead)).toBe(false);
      expect(schrodinger.equals(contradiction)).toBe(false);
      expect(schrodinger.equals(still)).toBe(false);
    });

    it('returns true if the same Equalable instance Alive given', () => {
      expect.assertions(3);
      const alive1: Alive<TestEqualable, MockRuntimeError> = Alive.of<TestEqualable, MockRuntimeError>(new TestEqualable(true));
      const alive2: Alive<TestEqualable, MockRuntimeError> = Alive.of<TestEqualable, MockRuntimeError>(new TestEqualable(false));

      const schrodinger: Schrodinger<TestEqualable, MockRuntimeError> = Alive.of<TestEqualable, MockRuntimeError>(new TestEqualable(true));

      expect(schrodinger.equals(schrodinger)).toBe(true);
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
