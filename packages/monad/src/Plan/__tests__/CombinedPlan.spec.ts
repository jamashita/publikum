import sinon, { SinonSpy } from 'sinon';

import { CombinedPlan } from '../CombinedPlan';
import { DisasterPlan } from '../Interface/DisasterPlan';
import { MappingPlan } from '../Interface/MappingPlan';
import { RecoveryPlan } from '../Interface/RecoveryPlan';
import { MockDisasterPlan } from '../Mock/MockDisasterPlan';
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
      const disaster: DisasterPlan = new MockDisasterPlan();

      mapping.onMap = spy1;
      recovery.onRecover = spy2;
      disaster.onDisaster = spy3;

      const plan: CombinedPlan<void, void> = CombinedPlan.of<void, void>(mapping, recovery, disaster);

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
      const disaster: DisasterPlan = new MockDisasterPlan();

      mapping.onMap = spy1;
      recovery.onRecover = spy2;
      disaster.onDisaster = spy3;

      const plan: CombinedPlan<void, void> = CombinedPlan.of<void, void>(mapping, recovery, disaster);

      plan.onRecover();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });
  });

  describe('onDisaster', () => {
    it('normal case', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const mapping: MappingPlan<void> = new MockMappingPlan();
      const recovery: RecoveryPlan<void> = new MockRecoveryPlan();
      const disaster: DisasterPlan = new MockDisasterPlan();

      mapping.onMap = spy1;
      recovery.onRecover = spy2;
      disaster.onDisaster = spy3;

      const plan: CombinedPlan<void, void> = CombinedPlan.of<void, void>(mapping, recovery, disaster);

      plan.onDisaster(undefined);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
