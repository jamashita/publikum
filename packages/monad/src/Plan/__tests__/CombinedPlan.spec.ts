import sinon, { SinonSpy } from 'sinon';

import { CombinedPlan } from '../CombinedPlan';
import { MappingPlan } from '../Interface/MappingPlan';
import { RecoveryPlan } from '../Interface/RecoveryPlan';
import { MockMappingPlan } from '../Mock/MockMappingPlan';
import { MockRecoveryPlan } from '../Mock/MockRecoveryPlan';

describe('CombinedPlan', () => {
  describe('onResolve', () => {
    it('normal case', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const resolve: MappingPlan<void> = new MockMappingPlan();
      const reject: RecoveryPlan<void> = new MockRecoveryPlan();

      resolve.onResolve = spy1;
      reject.onReject = spy2;

      const plan: CombinedPlan<void, void> = CombinedPlan.of<void, void>(resolve, reject);

      plan.onResolve();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });
  });

  describe('onReject', () => {
    it('normal case', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const resolve: MappingPlan<void> = new MockMappingPlan();
      const reject: RecoveryPlan<void> = new MockRecoveryPlan();

      resolve.onResolve = spy1;
      reject.onReject = spy2;

      const plan: CombinedPlan<void, void> = CombinedPlan.of<void, void>(resolve, reject);

      plan.onReject();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
