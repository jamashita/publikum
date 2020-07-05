import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';
import { Resolve } from '@jamashita/publikum-type';

import { PassEpoque } from '../../../Epoque/PassEpoque';
import { Alive } from '../../Schrodinger/Alive';
import { Contradiction } from '../../Schrodinger/Contradiction';
import { Dead } from '../../Schrodinger/Dead';
import { Superposition } from '../../Superposition';
import { AlivePlan } from '../AlivePlan';

describe('AlivePlan', () => {
  describe('onMap', () => {
    it('A given', () => {
      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const plan: AlivePlan<number, number, MockError> = AlivePlan.of<number, number, MockError>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

          return n - 1;
        },
        PassEpoque.of<number, MockError>(
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
        ),
        []
      );

      plan.onMap(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('Promise<A> given', async () => {
      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: AlivePlan<number, number, MockError> = AlivePlan.of<number, number, MockError>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Promise.resolve<number>(n - 2);
          },
          PassEpoque.of<number, MockError>(
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
          ),
          []
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('Alive Superposition<A, D> given', async () => {
      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: AlivePlan<number, number, MockError> = AlivePlan.of<number, number, MockError>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Superposition.ofSchrodinger<number, MockError>(Alive.of<number, MockError>(n - 3));
          },
          PassEpoque.of<number, MockError>(
            (n: number) => {
              spy2();
              expect(n).toBe(value - 3);

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
          []
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('D thrown', () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const plan: AlivePlan<number, number, MockError> = AlivePlan.of<number, number, MockError>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

          throw error;
        },
        PassEpoque.of<number, MockError>(
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

      plan.onMap(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('Promise<A> rejected', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: AlivePlan<number, number, MockError> = AlivePlan.of<number, number, MockError>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

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
            },
            () => {
              spy4();

              resolve();
            }
          ),
          [MockError]
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('Dead Superposition<A, D> given', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: AlivePlan<number, number, MockError> = AlivePlan.of<number, number, MockError>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Superposition.ofSchrodinger<number, MockError>(Dead.of<number, MockError>(error));
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
            },
            () => {
              spy4();

              resolve();
            }
          ),
          [MockError]
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('error thrown', () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const plan: AlivePlan<number, number, MockError> = AlivePlan.of<number, number, MockError>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

          throw error;
        },
        PassEpoque.of<number, MockError>(
          () => {
            spy2();
          },
          () => {
            spy3();
          },
          (e: unknown) => {
            spy4();
            expect(e).toBe(error);
          }
        ),
        []
      );

      plan.onMap(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('Promise rejected given', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: AlivePlan<number, number, MockError> = AlivePlan.of<number, number, MockError>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Promise.reject<number>(error);
          },
          PassEpoque.of<number, MockError>(
            () => {
              spy2();

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            (e: unknown) => {
              spy4();
              expect(e).toBe(error);

              resolve();
            }
          ),
          []
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('Contradiction Superposition given', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: AlivePlan<number, number, MockError> = AlivePlan.of<number, number, MockError>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Superposition.ofSchrodinger<number, MockError>(Contradiction.of<number, MockError>(error));
          },
          PassEpoque.of<number, MockError>(
            () => {
              spy2();

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            (e: unknown) => {
              spy4();
              expect(e).toBe(error);

              resolve();
            }
          ),
          []
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });
  });
});
