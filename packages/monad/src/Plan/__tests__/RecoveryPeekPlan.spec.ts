import sinon, { SinonSpy } from 'sinon';

import { DeclineEpoque } from '../../Epoque/Interface/DeclineEpoque';
import { PassEpoque } from '../../Epoque/PassEpoque';
import { RecoveryPeekPlan } from '../RecoveryPeekPlan';

describe('RecoveryPeekPlan', () => {
  describe('onRecover', () => {
    it('sync', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: DeclineEpoque<void> = PassEpoque.of<unknown, void>(
        () => {
          spy1();
        },
        () => {
          spy2();
        },
        () => {
          spy3();
        }
      );
      const plan: RecoveryPeekPlan = RecoveryPeekPlan.of(epoque);

      plan.onRecover();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('async', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: DeclineEpoque<void> = PassEpoque.of<unknown, void>(
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          spy1();
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
      const plan: RecoveryPeekPlan = RecoveryPeekPlan.of(epoque);

      plan.onRecover();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });
  });
});
