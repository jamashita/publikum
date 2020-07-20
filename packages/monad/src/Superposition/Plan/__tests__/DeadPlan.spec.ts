import { MockError } from '@jamashita/publikum-object';
import { Resolve } from '@jamashita/publikum-type';
import sinon, { SinonSpy } from 'sinon';

import { CombinedEpoque } from '../../../Epoque/CombinedEpoque';
import { Epoque } from '../../../Epoque/Interface/Epoque';
import { Detoxicated } from '../../Interface/Detoxicated';
import { Superposition } from '../../Superposition';
import { DeadPlan } from '../DeadPlan';

describe('DeadPlan', () => {
  describe('onRecover', () => {
    it('A given', () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const plan: DeadPlan<number, MockError, MockError> = DeadPlan.of<number, MockError, MockError>(
        (e: MockError) => {
          spy1();
          expect(e).toBe(error);

          return value;
        },
        CombinedEpoque.of<number, MockError>(
          (n: number) => {
            spy2();
            expect(n).toBe(value);
          },
          () => {
            spy3();
          },
          () => {
            spy4();
          }
        ),
        [MockError]
      );

      plan.onRecover(error);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('Promise<A> given', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockError, MockError> = DeadPlan.of<number, MockError, MockError>(
          (e: MockError) => {
            spy1();
            expect(e).toBe(error);

            return Promise.resolve<number>(value);
          },
          CombinedEpoque.of<number, MockError>(
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
            }
          ),
          [MockError]
        );

        plan.onRecover(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('Alive Superposition<A, D> given', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockError, MockError> = DeadPlan.of<number, MockError, MockError>(
          (e: MockError) => {
            spy1();
            expect(e).toBe(error);

            return Superposition.alive<number, MockError>(value);
          },
          CombinedEpoque.of<number, MockError>(
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
            }
          ),
          [MockError]
        );

        plan.onRecover(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('D thrown', () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const plan: DeadPlan<number, MockError, MockError> = DeadPlan.of<number, MockError, MockError>(
        (e: MockError) => {
          spy1();
          expect(e).toBe(error);

          throw error;
        },
        CombinedEpoque.of<number, MockError>(
          () => {
            spy2();
          },
          (e: MockError) => {
            spy3();
            expect(e).toBe(error);
          },
          () => {
            spy4();
          }
        ),
        [MockError]
      );

      plan.onRecover(error);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('Promise<A> rejected', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockError, MockError> = DeadPlan.of<number, MockError, MockError>(
          (e: MockError) => {
            spy1();
            expect(e).toBe(error);

            return Promise.reject<number>(error);
          },
          CombinedEpoque.of<number, MockError>(
            () => {
              spy2();

              resolve();
            },
            (e: MockError) => {
              spy3();
              expect(e).toBe(error);

              resolve();
            },
            () => {
              spy4();

              resolve();
            }
          ),
          [MockError]
        );

        plan.onRecover(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('Dead Superposition<A, D> given', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockError, MockError> = DeadPlan.of<number, MockError, MockError>(
          (e: MockError) => {
            spy1();
            expect(e).toBe(error);

            return Superposition.dead<number, MockError>(error, MockError);
          },
          CombinedEpoque.of<number, MockError>(
            () => {
              spy2();

              resolve();
            },
            (e: MockError) => {
              spy3();
              expect(e).toBe(error);

              resolve();
            },
            () => {
              spy4();

              resolve();
            }
          ),
          [MockError]
        );

        plan.onRecover(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('error thrown', () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const plan: DeadPlan<number, MockError, MockError> = DeadPlan.of<number, MockError, MockError>(
        (e: MockError) => {
          spy1();
          expect(e).toBe(error);

          throw error;
        },
        CombinedEpoque.of<number, MockError>(
          () => {
            spy2();
          },
          (e: MockError) => {
            spy3();
            expect(e).toBe(error);
          },
          () => {
            spy4();
          }
        ),
        []
      );

      plan.onRecover(error);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('Promise rejected given', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockError, MockError> = DeadPlan.of<number, MockError, MockError>(
          (e: MockError) => {
            spy1();
            expect(e).toBe(error);

            return Promise.reject<number>(error);
          },
          CombinedEpoque.of<number, MockError>(
            () => {
              spy2();

              resolve();
            },
            (e: MockError) => {
              spy3();
              expect(e).toBe(error);

              resolve();
            },
            () => {
              spy4();

              resolve();
            }
          ),
          []
        );

        plan.onRecover(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('Contradiction Superposition given', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: DeadPlan<number, MockError, MockError> = DeadPlan.of<number, MockError, MockError>(
          (e: MockError) => {
            spy1();
            expect(e).toBe(error);

            return Superposition.of<number, MockError>((epoque: Epoque<Detoxicated<number>, MockError>) => {
              return epoque.throw(error);
            });
          },
          CombinedEpoque.of<number, MockError>(
            () => {
              spy2();

              resolve();
            },
            (e: MockError) => {
              spy3();
              expect(e).toBe(error);

              resolve();
            },
            () => {
              spy4();

              resolve();
            }
          ),
          []
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
