import sinon, { SinonSpy } from 'sinon';

import { DeclineEpoque } from '../../Epoque/Interface/DeclineEpoque';
import { PassEpoque } from '../../Epoque/PassEpoque';
import { RecoveryConsumerPlan } from '../RecoveryConsumerPlan';

describe('RecoveryConsumerPlan', () => {
  describe('onRecover', () => {
    it('sync', () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: DeclineEpoque<number> = PassEpoque.of<unknown, number>(
        () => {
          spy1();
        },
        (n: number) => {
          spy2();
          expect(n).toBe(value);
        },
        () => {
          spy3();
        }
      );
      const plan: RecoveryConsumerPlan<number> = RecoveryConsumerPlan.of<number>(epoque);

      plan.onRecover(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('async', () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: DeclineEpoque<number> = PassEpoque.of<unknown, number>(
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          spy1();
        },
        // eslint-disable-next-line @typescript-eslint/require-await
        async (n: number) => {
          spy2();
          expect(n).toBe(value);
        },
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          spy3();
        }
      );
      const plan: RecoveryConsumerPlan<number> = RecoveryConsumerPlan.of<number>(epoque);

      plan.onRecover(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });
  });
});
