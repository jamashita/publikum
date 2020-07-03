import sinon, { SinonSpy } from 'sinon';

import { CombinedPlan } from '../CombinedPlan';
import { MappingPlan } from '../Interface/MappingPlan';
import { RecoveryPlan } from '../Interface/RecoveryPlan';
import { MockMappingPlan } from '../Mock/MockMappingPlan';
import { MockRecoveryPlan } from '../Mock/MockRecoveryPlan';

describe('CombinedPlan', () => {
  describe('onMap', () => {
    it('normal case', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const resolve: MappingPlan<void> = new MockMappingPlan();
      const reject: RecoveryPlan<void> = new MockRecoveryPlan();

      resolve.onMap = spy1;
      reject.onRecover = spy2;

      const plan: CombinedPlan<void, void> = CombinedPlan.of<void, void>(resolve, reject);

      plan.onMap();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });
  });

  describe('onRecover', () => {
    it('normal case', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const resolve: MappingPlan<void> = new MockMappingPlan();
      const reject: RecoveryPlan<void> = new MockRecoveryPlan();

      resolve.onMap = spy1;
      reject.onRecover = spy2;

      const plan: CombinedPlan<void, void> = CombinedPlan.of<void, void>(resolve, reject);

      plan.onRecover();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
