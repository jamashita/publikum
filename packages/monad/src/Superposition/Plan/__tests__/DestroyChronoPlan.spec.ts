import sinon, { SinonSpy } from 'sinon';
import { CombinedChrono } from '../../Chrono/CombinedChrono';
import { ThrowChrono } from '../../Chrono/Interface/ThrowChrono';
import { DestroyChronoPlan } from '../DestroyChronoPlan';

describe('DestroyChronoPlan', () => {
  describe('onRecover', () => {
    it('sync', () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const chrono: ThrowChrono = CombinedChrono.of<unknown, unknown>(
        () => {
          spy1();
        },
        () => {
          spy2();
        },
        (n: unknown) => {
          spy3();
          expect(n).toBe(value);
        }
      );
      const plan: DestroyChronoPlan = DestroyChronoPlan.of(chrono);

      plan.onDestroy(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('async', () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const chrono: ThrowChrono = CombinedChrono.of<unknown, unknown>(
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          spy1();
        },
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          spy2();
        },
        // eslint-disable-next-line @typescript-eslint/require-await
        async (n: unknown) => {
          spy3();
          expect(n).toBe(value);
        }
      );
      const plan: DestroyChronoPlan = DestroyChronoPlan.of(chrono);

      plan.onDestroy(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
