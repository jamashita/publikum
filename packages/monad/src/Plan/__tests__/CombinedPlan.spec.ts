import sinon, { SinonSpy } from 'sinon';
import { CombinedPlan } from '../CombinedPlan';
import { DestroyPlan } from '../Interface/DestroyPlan';
import { MappingPlan } from '../Interface/MappingPlan';
import { RecoveryPlan } from '../Interface/RecoveryPlan';
import { MockDestroyPlan } from '../Mock/MockDestroyPlan';
import { MockMappingPlan } from '../Mock/MockMappingPlan';
import { MockRecoveryPlan } from '../Mock/MockRecoveryPlan';

describe('CombinedPlan', () => {
  describe('onMap', () => {
    it('normal case', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const mapping: MappingPlan<void> = new MockMappingPlan();
      const recovery: RecoveryPlan<void> = new MockRecoveryPlan();
      const destroy: DestroyPlan = new MockDestroyPlan();

      mapping.onMap = spy1;
      recovery.onRecover = spy2;
      destroy.onDestroy = spy3;

      const plan: CombinedPlan<void, void> = CombinedPlan.of<void, void>(mapping, recovery, destroy);

      plan.onMap();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });
  });

  describe('onRecover', () => {
    it('normal case', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const mapping: MappingPlan<void> = new MockMappingPlan();
      const recovery: RecoveryPlan<void> = new MockRecoveryPlan();
      const destroy: DestroyPlan = new MockDestroyPlan();

      mapping.onMap = spy1;
      recovery.onRecover = spy2;
      destroy.onDestroy = spy3;

      const plan: CombinedPlan<void, void> = CombinedPlan.of<void, void>(mapping, recovery, destroy);

      plan.onRecover();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });
  });

  describe('onDestroy', () => {
    it('normal case', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const mapping: MappingPlan<void> = new MockMappingPlan();
      const recovery: RecoveryPlan<void> = new MockRecoveryPlan();
      const destroy: DestroyPlan = new MockDestroyPlan();

      mapping.onMap = spy1;
      recovery.onRecover = spy2;
      destroy.onDestroy = spy3;

      const plan: CombinedPlan<void, void> = CombinedPlan.of<void, void>(mapping, recovery, destroy);

      plan.onDestroy(undefined);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
