import { MockError } from '@jamashita/publikum-object';
import sinon, { SinonSpy } from 'sinon';
import { MockChrono } from '../../Chrono/Mock/MockChrono';
import { DeadConstructor } from '../../Interface/DeadConstructor';
import { RecoveryChronoPlan } from '../RecoveryChronoPlan';

describe('RecoveryChronoPlan', () => {
  describe('onRecover', () => {
    it('normal case', () => {
      expect.assertions(4);
      const value: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const chrono: MockChrono<number, MockError> = new MockChrono<number, MockError>(
        () => {
          spy1();
        },
        (v: MockError) => {
          spy2();
          expect(v).toBe(value);
        },
        () => {
          spy3();
        },
        new Set<DeadConstructor<MockError>>()
      );
      const plan: RecoveryChronoPlan<number, MockError> = RecoveryChronoPlan.of<number, MockError>(chrono);

      plan.onRecover(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });
  });
});
