import { MockError } from '@jamashita/publikum-object';
import { Resolve } from '@jamashita/publikum-type';
import sinon, { SinonSpy } from 'sinon';
import { Superposition } from '../../Superposition';
import { DeadChrono } from '../DeadChrono';
import { Chrono } from '../Interface/Chrono';
import { PassThroughChrono } from '../PassThroughChrono';

describe('DeadChrono', () => {
  describe('decline', () => {
    it('a given', () => {
      expect.assertions(6);
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const chrono: DeadChrono<number, MockError, MockError> = DeadChrono.of<number, MockError, MockError>(
        (e: MockError) => {
          spy1();
          expect(e).toBe(error);

          return value;
        },
        PassThroughChrono.of<number, MockError>(
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
          MockError
        )
      );

      chrono.decline(error);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('promise<A> given', async () => {
      expect.assertions(6);
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const chrono: DeadChrono<number, MockError, MockError> = DeadChrono.of<number, MockError, MockError>(
          (e: MockError) => {
            spy1();
            expect(e).toBe(error);

            return Promise.resolve<number>(value);
          },
          PassThroughChrono.of<number, MockError>(
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
            MockError
          )
        );

        chrono.decline(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('alive Superposition<A, D> given', async () => {
      expect.assertions(6);
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const chrono: DeadChrono<number, MockError, MockError> = DeadChrono.of<number, MockError, MockError>(
          (e: MockError) => {
            spy1();
            expect(e).toBe(error);

            return Superposition.alive<number, MockError>(value);
          },
          PassThroughChrono.of<number, MockError>(
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
            MockError
          )
        );

        chrono.decline(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('d thrown', () => {
      expect.assertions(6);
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const chrono: DeadChrono<number, MockError, MockError> = DeadChrono.of<number, MockError, MockError>(
        (e: MockError) => {
          spy1();
          expect(e).toBe(error);

          throw error;
        },
        PassThroughChrono.of<number, MockError>(
          () => {
            spy2();
          },
          (e: MockError) => {
            spy3();
            expect(e).toBe(error);
          },
          () => {
            spy4();
          },
          MockError
        )
      );

      chrono.decline(error);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('promise<A> rejected', async () => {
      expect.assertions(6);
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const chrono: DeadChrono<number, MockError, MockError> = DeadChrono.of<number, MockError, MockError>(
          (e: MockError) => {
            spy1();
            expect(e).toBe(error);

            return Promise.reject<number>(error);
          },
          PassThroughChrono.of<number, MockError>(
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
            },
            MockError
          )
        );

        chrono.decline(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('dead Superposition<A, D> given', async () => {
      expect.assertions(6);
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const chrono: DeadChrono<number, MockError, MockError> = DeadChrono.of<number, MockError, MockError>(
          (e: MockError) => {
            spy1();
            expect(e).toBe(error);

            return Superposition.dead<number, MockError>(error, MockError);
          },
          PassThroughChrono.of<number, MockError>(
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
            },
            MockError
          )
        );

        chrono.decline(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('error thrown', () => {
      expect.assertions(5);
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const chrono: DeadChrono<number, MockError, MockError> = DeadChrono.of<number, MockError, MockError>(
        (e: MockError) => {
          spy1();
          expect(e).toBe(error);

          throw error;
        },
        PassThroughChrono.of<number, MockError>(
          () => {
            spy2();
          },
          () => {
            spy3();
          },
          () => {
            spy4();
          }
        )
      );

      chrono.decline(error);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('promise rejected given', async () => {
      expect.assertions(5);
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const chrono: DeadChrono<number, MockError, MockError> = DeadChrono.of<number, MockError, MockError>(
          (e: MockError) => {
            spy1();
            expect(e).toBe(error);

            return Promise.reject<number>(error);
          },
          PassThroughChrono.of<number, MockError>(
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
            }
          )
        );

        chrono.decline(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('contradiction Superposition given', async () => {
      expect.assertions(5);
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const chrono: DeadChrono<number, MockError, MockError> = DeadChrono.of<number, MockError, MockError>(
          (e: MockError) => {
            spy1();
            expect(e).toBe(error);

            return Superposition.of<number, MockError>((c: Chrono<number, MockError>) => {
              return c.throw(error);
            });
          },
          PassThroughChrono.of<number, MockError>(
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
            }
          )
        );

        chrono.decline(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });
  });
});
