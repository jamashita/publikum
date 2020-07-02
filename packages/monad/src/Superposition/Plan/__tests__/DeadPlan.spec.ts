import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';
import { Resolve } from '@jamashita/publikum-type';

import { PassEpoque } from '../../../Epoque/PassEpoque';
import { Alive } from '../../Schrodinger/Alive';
import { Dead } from '../../Schrodinger/Dead';
import { Superposition } from '../../Superposition';
import { DeadPlan } from '../DeadPlan';

describe('DeadPlan', () => {
  describe('onReject', () => {
    it('A given', () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const plan: DeadPlan<number, MockError, MockError> = DeadPlan.of<number, MockError, MockError>(
        (e: MockError) => {
          spy1();
          expect(e).toBe(error);

          return value;
        },
        PassEpoque.of<number, MockError>(
          (n: number) => {
            spy2();
            expect(n).toBe(value);
          },
          () => {
            spy3();
          }
        )
      );

      plan.onReject(error);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('Promise<A> given', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockError, MockError> = DeadPlan.of<number, MockError, MockError>(
          (e: MockError) => {
            spy1();
            expect(e).toBe(error);

            return Promise.resolve<number>(value);
          },
          PassEpoque.of<number, MockError>(
            (n: number) => {
              spy2();
              expect(n).toBe(value);

              resolve();
            },
            () => {
              spy3();

              resolve();
            }
          )
        );

        plan.onReject(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('Alive Superposition<A, D> given', () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const plan: DeadPlan<number, MockError, MockError> = DeadPlan.of<number, MockError, MockError>(
        (e: MockError) => {
          spy1();
          expect(e).toBe(error);

          return Superposition.ofSchrodinger<number, MockError>(Alive.of<number, MockError>(value));
        },
        PassEpoque.of<number, MockError>(
          (n: number) => {
            spy2();
            expect(n).toBe(value);
          },
          () => {
            spy3();
          }
        )
      );

      plan.onReject(error);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('D thrown', () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const plan: DeadPlan<number, MockError, MockError> = DeadPlan.of<number, MockError, MockError>(
        (e: MockError) => {
          spy1();
          expect(e).toBe(error);

          throw error;
        },
        PassEpoque.of<number, MockError>(
          () => {
            spy2();
          },
          (e: MockError) => {
            spy3();
            expect(e).toBe(error);
          }
        )
      );

      plan.onReject(error);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('Promise<A> rejected', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockError, MockError> = DeadPlan.of<number, MockError, MockError>(
          (e: MockError) => {
            spy1();
            expect(e).toBe(error);

            return Promise.reject<number>(error);
          },
          PassEpoque.of<number, MockError>(
            () => {
              spy2();

              resolve();
            },
            (e: MockError) => {
              spy3();
              expect(e).toBe(error);

              resolve();
            }
          )
        );

        plan.onReject(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('Dead Superposition<A, D> given', () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const plan: DeadPlan<number, MockError, MockError> = DeadPlan.of<number, MockError, MockError>(
        (e: MockError) => {
          spy1();
          expect(e).toBe(error);

          return Superposition.ofSchrodinger<number, MockError>(Dead.of<number, MockError>(error));
        },
        PassEpoque.of<number, MockError>(
          () => {
            spy2();
          },
          (e: MockError) => {
            spy3();
            expect(e).toBe(error);
          }
        )
      );

      plan.onReject(error);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
