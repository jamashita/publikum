import { MockError } from '@jamashita/publikum-object';
import sinon, { SinonSpy } from 'sinon';
import { MockChrono } from '../../Chrono/Mock/MockChrono';
import { DeadConstructor } from '../../Interface/DeadConstructor';
import { DestroyChronoPlan } from '../DestroyChronoPlan';

describe('DestroyChronoPlan', () => {
  describe('onDestroy', () => {
    it('normal case', () => {
      expect.assertions(4);
      const value: number = -35;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const chrono: MockChrono<number, MockError> = new MockChrono<number, MockError>(
        () => {
          spy1();
        },
        () => {
          spy2();
        },
        (v: unknown) => {
          spy3();
          expect(v).toBe(value);
        },
        new Set<DeadConstructor<MockError>>()
      );
      const plan: DestroyChronoPlan<number, MockError> = DestroyChronoPlan.of<number, MockError>(chrono);

      plan.onDestroy(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
