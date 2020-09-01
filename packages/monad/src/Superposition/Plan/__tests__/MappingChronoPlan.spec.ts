import sinon, { SinonSpy } from 'sinon';
import { CombinedChrono } from '../../Chrono/CombinedChrono';
import { AcceptChrono } from '../../Chrono/Interface/AcceptChrono';
import { MappingChronoPlan } from '../MappingChronoPlan';

describe('MappingPassPlan', () => {
  describe('onMap', () => {
    it('sync', () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const chrono: AcceptChrono<number> = CombinedChrono.of<number, number>(
        (v: number) => {
          spy1();
          expect(v).toBe(value);
        },
        () => {
          spy2();
        },
        () => {
          spy3();
        }
      );
      const plan: MappingChronoPlan<number> = MappingChronoPlan.of<number>(chrono);

      plan.onMap(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });

    it('async', () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const chrono: AcceptChrono<number> = CombinedChrono.of<number, number>(
        // eslint-disable-next-line @typescript-eslint/require-await
        async (v: number) => {
          spy1();
          expect(v).toBe(value);
        },
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          spy2();
        },
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          spy3();
        }
      );
      const plan: MappingChronoPlan<number> = MappingChronoPlan.of<number>(chrono);

      plan.onMap(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });
  });
});
