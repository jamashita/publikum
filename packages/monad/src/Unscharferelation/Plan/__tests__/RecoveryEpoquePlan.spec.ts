import sinon, { SinonSpy } from 'sinon';
import { CombinedEpoque } from '../../Epoque/CombinedEpoque';
import { DeclineEpoque } from '../../Epoque/Interface/DeclineEpoque';
import { RecoveryEpoquePlan } from '../RecoveryEpoquePlan';

describe('RecoveryEpoquePlan', () => {
  describe('onRecover', () => {
    it('sync', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: DeclineEpoque = CombinedEpoque.of<unknown>(
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
      const plan: RecoveryEpoquePlan = RecoveryEpoquePlan.of(epoque);

      plan.onRecover();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('async', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: DeclineEpoque = CombinedEpoque.of<unknown>(
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
      const plan: RecoveryEpoquePlan = RecoveryEpoquePlan.of(epoque);

      plan.onRecover();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });
  });
});
