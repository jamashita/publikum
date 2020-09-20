import { MockRuntimeError } from '@jamashita/publikum-error';
import { Resolve } from '@jamashita/publikum-type';
import sinon, { SinonSpy } from 'sinon';
import { Chrono } from '../../Chrono/Interface/Chrono';
import { MockChrono } from '../../Chrono/Mock/MockChrono';
import { DeadConstructor } from '../../Interface/DeadConstructor';
import { Superposition } from '../../Superposition';
import { DeadPlan } from '../DeadPlan';

describe('DeadPlan', () => {
  describe('onRecover', () => {
    it('A given', () => {
      expect.assertions(6);

      const value: number = 101;
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of<number, MockRuntimeError, MockRuntimeError>(
        (e: MockRuntimeError) => {
          spy1();
          expect(e).toBe(error);

          return value;
        },
        new MockChrono<number, MockRuntimeError>(
          (n: number) => {
            spy2();
            expect(n).toBe(value);
          },
          () => {
            spy3();
          },
          () => {
            spy4();
          },
          new Set<DeadConstructor<MockRuntimeError>>([MockRuntimeError])
        )
      );

      plan.onRecover(error);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('Promise<A> given', async () => {
      expect.assertions(6);

      const value: number = 101;
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of<number, MockRuntimeError, MockRuntimeError>(
          (e: MockRuntimeError) => {
            spy1();
            expect(e).toBe(error);

            return Promise.resolve<number>(value);
          },
          new MockChrono<number, MockRuntimeError>(
            (n: number) => {
              spy2();
              expect(n).toBe(value);

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            () => {
              spy4();

              resolve();
            },
            new Set<DeadConstructor<MockRuntimeError>>([MockRuntimeError])
          )
        );

        plan.onRecover(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('Alive Superposition<A, D> given', async () => {
      expect.assertions(6);

      const value: number = 101;
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of<number, MockRuntimeError, MockRuntimeError>(
          (e: MockRuntimeError) => {
            spy1();
            expect(e).toBe(error);

            return Superposition.alive<number, MockRuntimeError>(value);
          },
          new MockChrono<number, MockRuntimeError>(
            (n: number) => {
              spy2();
              expect(n).toBe(value);

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            () => {
              spy4();

              resolve();
            },
            new Set<DeadConstructor<MockRuntimeError>>([MockRuntimeError])
          )
        );

        plan.onRecover(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('Promise<Alive Superposition<A, D>> given', async () => {
      expect.assertions(6);

      const value: number = 101;
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of<number, MockRuntimeError, MockRuntimeError>(
          (e: MockRuntimeError) => {
            spy1();
            expect(e).toBe(error);

            return Promise.resolve<Superposition<number, MockRuntimeError>>(Superposition.alive<number, MockRuntimeError>(value));
          },
          new MockChrono<number, MockRuntimeError>(
            (n: number) => {
              spy2();
              expect(n).toBe(value);

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            () => {
              spy4();

              resolve();
            },
            new Set<DeadConstructor<MockRuntimeError>>([MockRuntimeError])
          )
        );

        plan.onRecover(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('D thrown', () => {
      expect.assertions(6);

      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of<number, MockRuntimeError, MockRuntimeError>(
        (e: MockRuntimeError) => {
          spy1();
          expect(e).toBe(error);

          throw error;
        },
        new MockChrono<number, MockRuntimeError>(
          () => {
            spy2();
          },
          (e: MockRuntimeError) => {
            spy3();
            expect(e).toBe(error);
          },
          () => {
            spy4();
          },
          new Set<DeadConstructor<MockRuntimeError>>([MockRuntimeError])
        )
      );

      plan.onRecover(error);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('Promise<A> rejected', async () => {
      expect.assertions(6);

      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of<number, MockRuntimeError, MockRuntimeError>(
          (e: MockRuntimeError) => {
            spy1();
            expect(e).toBe(error);

            return Promise.reject<number>(error);
          },
          new MockChrono<number, MockRuntimeError>(
            () => {
              spy2();

              resolve();
            },
            (e: MockRuntimeError) => {
              spy3();
              expect(e).toBe(error);

              resolve();
            },
            () => {
              spy4();

              resolve();
            },
            new Set<DeadConstructor<MockRuntimeError>>([MockRuntimeError])
          )
        );

        plan.onRecover(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('Dead Superposition<A, D> given', async () => {
      expect.assertions(6);

      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of<number, MockRuntimeError, MockRuntimeError>(
          (e: MockRuntimeError) => {
            spy1();
            expect(e).toBe(error);

            return Superposition.dead<number, MockRuntimeError>(error, MockRuntimeError);
          },
          new MockChrono<number, MockRuntimeError>(
            () => {
              spy2();

              resolve();
            },
            (e: MockRuntimeError) => {
              spy3();
              expect(e).toBe(error);

              resolve();
            },
            () => {
              spy4();

              resolve();
            },
            new Set<DeadConstructor<MockRuntimeError>>([MockRuntimeError])
          )
        );

        plan.onRecover(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('Promise<Dead Superposition<A, D>> given', async () => {
      expect.assertions(6);

      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of<number, MockRuntimeError, MockRuntimeError>(
          (e: MockRuntimeError) => {
            spy1();
            expect(e).toBe(error);

            return Promise.resolve<Superposition<number, MockRuntimeError>>(Superposition.dead<number, MockRuntimeError>(error, MockRuntimeError));
          },
          new MockChrono<number, MockRuntimeError>(
            () => {
              spy2();

              resolve();
            },
            (e: MockRuntimeError) => {
              spy3();
              expect(e).toBe(error);

              resolve();
            },
            () => {
              spy4();

              resolve();
            },
            new Set<DeadConstructor<MockRuntimeError>>([MockRuntimeError])
          )
        );

        plan.onRecover(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('error thrown', () => {
      expect.assertions(5);

      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of<number, MockRuntimeError, MockRuntimeError>(
        (e: MockRuntimeError) => {
          spy1();
          expect(e).toBe(error);

          throw error;
        },
        new MockChrono<number, MockRuntimeError>(
          () => {
            spy2();
          },
          () => {
            spy3();
          },
          () => {
            spy4();
          },
          new Set<DeadConstructor<MockRuntimeError>>()
        )
      );

      plan.onRecover(error);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('Promise rejected given', async () => {
      expect.assertions(5);

      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of<number, MockRuntimeError, MockRuntimeError>(
          (e: MockRuntimeError) => {
            spy1();
            expect(e).toBe(error);

            return Promise.reject<number>(error);
          },
          new MockChrono<number, MockRuntimeError>(
            () => {
              spy2();

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            () => {
              spy4();

              resolve();
            },
            new Set<DeadConstructor<MockRuntimeError>>()
          )
        );

        plan.onRecover(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('Contradiction Superposition given', async () => {
      expect.assertions(5);

      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockRuntimeError, MockRuntimeError> = DeadPlan.of<number, MockRuntimeError, MockRuntimeError>(
          (e: MockRuntimeError) => {
            spy1();
            expect(e).toBe(error);

            return Superposition.of<number, MockRuntimeError>((c: Chrono<number, MockRuntimeError>) => {
              return c.throw(error);
            });
          },
          new MockChrono<number, MockRuntimeError>(
            () => {
              spy2();

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            () => {
              spy4();

              resolve();
            },
            new Set<DeadConstructor<MockRuntimeError>>()
          )
        );

        plan.onRecover(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });
  });
});
