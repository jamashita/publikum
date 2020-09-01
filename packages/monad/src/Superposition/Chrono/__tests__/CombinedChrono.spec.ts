import { MockError } from '@jamashita/publikum-object';
import sinon, { SinonSpy } from 'sinon';
import { DeadConstructor } from '../../Interface/DeadConstructor';
import { CombinedChrono } from '../CombinedChrono';

describe('CombinedChrono', () => {
  describe('accept', () => {
    it('normal case', () => {
      const value: number = -35;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: CombinedChrono<number, number> = CombinedChrono.of<number, number>(
        (v: number, errors: ReadonlyArray<DeadConstructor>) => {
          spy1();
          expect(v).toBe(value);
          expect(errors.includes(MockError)).toBe(true);
        },
        () => {
          spy2();
        },
        () => {
          spy3();
        }
      );

      epoque.accept(value, MockError);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });
  });

  describe('decline', () => {
    it('normal case', () => {
      const value: number = -35;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: CombinedChrono<number, number> = CombinedChrono.of<number, number>(
        () => {
          spy1();
        },
        (v: number, errors: ReadonlyArray<DeadConstructor>) => {
          spy2();
          expect(v).toBe(value);
          expect(errors.includes(MockError)).toBe(true);
        },
        () => {
          spy3();
        }
      );

      epoque.decline(value, MockError);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });
  });

  describe('throw', () => {
    it('normal case', () => {
      const value: number = -35;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: CombinedChrono<number, number> = CombinedChrono.of<number, number>(
        () => {
          spy1();
        },
        () => {
          spy2();
        },
        (v: unknown, errors: ReadonlyArray<DeadConstructor>) => {
          spy3();
          expect(v).toBe(value);
          expect(errors.includes(MockError)).toBe(true);
        }
      );

      epoque.throw(value, MockError);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
