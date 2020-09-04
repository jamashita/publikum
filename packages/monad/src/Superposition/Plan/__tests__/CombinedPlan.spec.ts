import { MockError } from '@jamashita/publikum-object';
import sinon, { SinonSpy } from 'sinon';
import { PassThroughPlan } from '../../../Plan/PassThroughPlan';
import { CombinedPlan } from '../CombinedPlan';

describe('CombinedPlan', () => {
  describe('onMap', () => {
    it('normal case', () => {
      expect.assertions(4);
      const value: number = -35;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const pass: PassThroughPlan<number, MockError> = PassThroughPlan.of<number, MockError>(
        (v: number) => {
          spy1();
          expect(v).toBe(value);
        },
        () => {
          spy2();
        },
        () => {
          spy3();
        }
      );
      const plan: CombinedPlan<number, MockError> = CombinedPlan.of<number, MockError>(pass, pass, pass);

      plan.onMap(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });
  });

  describe('onRecover', () => {
    it('normal case', () => {
      expect.assertions(4);
      const value: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const pass: PassThroughPlan<number, MockError> = PassThroughPlan.of<number, MockError>(
        () => {
          spy1();
        },
        (v: MockError) => {
          spy2();
          expect(v).toBe(value);
        },
        () => {
          spy3();
        }
      );
      const plan: CombinedPlan<number, MockError> = CombinedPlan.of<number, MockError>(pass, pass, pass);

      plan.onRecover(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });
  });

  describe('onDestroy', () => {
    it('normal case', () => {
      expect.assertions(4);
      const value: number = -35;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const pass: PassThroughPlan<number, MockError> = PassThroughPlan.of<number, MockError>(
        () => {
          spy1();
        },
        () => {
          spy2();
        },
        (v: unknown) => {
          spy3();
          expect(v).toBe(value);
        }
      );
      const plan: CombinedPlan<number, MockError> = CombinedPlan.of<number, MockError>(pass, pass, pass);

      plan.onDestroy(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
