import sinon, { SinonSpy } from 'sinon';

import { CombinedEpoque } from '../../Epoque/CombinedEpoque';
import { ThrowEpoque } from '../../Epoque/Interface/ThrowEpoque';
import { DestroyPassPlan } from '../DestroyPassPlan';

describe('DestroyPassPlan', () => {
  describe('onRecover', () => {
    it('sync', () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: ThrowEpoque = CombinedEpoque.of<unknown, number>(
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
      const plan: DestroyPassPlan = DestroyPassPlan.of(epoque);

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

      const epoque: ThrowEpoque = CombinedEpoque.of<unknown, number>(
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
      const plan: DestroyPassPlan = DestroyPassPlan.of(epoque);

      plan.onDestroy(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
