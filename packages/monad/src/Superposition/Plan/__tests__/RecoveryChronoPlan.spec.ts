import sinon, { SinonSpy } from 'sinon';
import { CombinedChrono } from '../../Chrono/CombinedChrono';
import { DeclineChrono } from '../../Chrono/Interface/DeclineChrono';
import { RecoveryChronoPlan } from '../RecoveryChronoPlan';

describe('RecoveryChronoPlan', () => {
  describe('onRecover', () => {
    it('sync', () => {
      const value: number = 2;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const chrono: DeclineChrono<number> = CombinedChrono.of<number, number>(
        () => {
          spy1();
        },
        (v: number) => {
          spy2();
          expect(v).toBe(value);
        },
        () => {
          spy3();
        }
      );
      const plan: RecoveryChronoPlan<number> = RecoveryChronoPlan.of<number>(chrono);

      plan.onRecover(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('async', () => {
      const value: number = 2;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const chrono: DeclineChrono<number> = CombinedChrono.of<number, number>(
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          spy1();
        },
        // eslint-disable-next-line @typescript-eslint/require-await
        async (v: number) => {
          spy2();
          expect(v).toBe(value);
        },
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          spy3();
        }
      );
      const plan: RecoveryChronoPlan<number> = RecoveryChronoPlan.of<number>(chrono);

      plan.onRecover(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });
  });
});
