import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';
import { Resolve } from '@jamashita/publikum-type';

import { PassEpoque } from '../../../Epoque/PassEpoque';
import { DisappearedPlan } from '../DisappearedPlan';

describe('DisappearedPlan', () => {
  describe('onRecover', () => {
    it('R given', () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const plan: DisappearedPlan<number> = DisappearedPlan.of<number>(
        (err: unknown) => {
          spy1();
          expect(err).toBe(error);

          return value - 1;
        },
        PassEpoque.of<number, unknown>(
          (n: number) => {
            spy2();
            expect(n).toBe(value - 1);
          },
          () => {
            spy3();
          },
          () => {
            spy4();
          }
        )
      );

      plan.onRecover(error);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('Promise<R> given', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DisappearedPlan<number> = DisappearedPlan.of<number>(
          (err: unknown) => {
            spy1();
            expect(err).toBe(error);

            return Promise.resolve<number>(value - 2);
          },
          PassEpoque.of<number, unknown>(
            (n: number) => {
              spy2();
              expect(n).toBe(value - 2);

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            () => {
              spy4();

              resolve();
            }
          )
        );

        plan.onRecover(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('Error thrown', () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const plan: DisappearedPlan<number> = DisappearedPlan.of<number>(
        (err: unknown) => {
          spy1();
          expect(err).toBe(error1);

          throw error2;
        },
        PassEpoque.of<number, unknown>(
          () => {
            spy2();
          },
          (e: unknown) => {
            spy3();
            expect(e).toBe(error2);
          },
          () => {
            spy4();
          }
        )
      );

      plan.onRecover(error1);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('Promise<R> rejected', async () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DisappearedPlan<number> = DisappearedPlan.of<number>(
          (err: unknown) => {
            spy1();
            expect(err).toBe(error1);

            return Promise.reject<number>(error2);
          },
          PassEpoque.of<number, unknown>(
            () => {
              spy2();

              resolve();
            },
            (e: unknown) => {
              spy3();
              expect(e).toBe(error2);

              resolve();
            },
            () => {
              spy4();

              resolve();
            }
          )
        );

        plan.onRecover(error1);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });
  });
});
