import { MockError } from '@jamashita/publikum-object';
import { Resolve } from '@jamashita/publikum-type';
import sinon, { SinonSpy } from 'sinon';
import { Superposition } from '../../Superposition';
import { AliveChrono } from '../AliveChrono';
import { Chrono } from '../Interface/Chrono';
import { PassThroughChrono } from '../PassThroughChrono';

describe('AliveChrono', () => {
  describe('accept', () => {
    it('a given', () => {
      expect.assertions(4);
      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const chrono: AliveChrono<number, number, MockError> = AliveChrono.of<number, number, MockError>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

          return n - 1;
        },
        PassThroughChrono.of<number, MockError>(
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

      chrono.accept(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('promise<A> given', async () => {
      expect.assertions(4);
      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const chrono: AliveChrono<number, number, MockError> = AliveChrono.of<number, number, MockError>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Promise.resolve<number>(n - 2);
          },
          PassThroughChrono.of<number, MockError>(
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

        chrono.accept(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('alive Superposition<A, D> given', async () => {
      expect.assertions(4);
      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const chrono: AliveChrono<number, number, MockError> = AliveChrono.of<number, number, MockError>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Superposition.alive<number, MockError>(n - 3);
          },
          PassThroughChrono.of<number, MockError>(
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
          )
        );

        chrono.accept(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('d thrown', () => {
      expect.assertions(4);
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const chrono: AliveChrono<number, number, MockError> = AliveChrono.of<number, number, MockError>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

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

      chrono.accept(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('promise<A> rejected', async () => {
      expect.assertions(4);
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const chrono: AliveChrono<number, number, MockError> = AliveChrono.of<number, number, MockError>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

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

        chrono.accept(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('dead Superposition<A, D> given', async () => {
      expect.assertions(4);
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const chrono: AliveChrono<number, number, MockError> = AliveChrono.of<number, number, MockError>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

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

        chrono.accept(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('error thrown', () => {
      expect.assertions(4);
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const chrono: AliveChrono<number, number, MockError> = AliveChrono.of<number, number, MockError>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

          throw error;
        },
        PassThroughChrono.of<number, MockError>(
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
        )
      );

      chrono.accept(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('promise rejected given', async () => {
      expect.assertions(4);
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const chrono: AliveChrono<number, number, MockError> = AliveChrono.of<number, number, MockError>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

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
            (e: unknown) => {
              spy4();
              expect(e).toBe(error);

              resolve();
            }
          )
        );

        chrono.accept(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('contradiction Superposition given', async () => {
      expect.assertions(4);
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const chrono: AliveChrono<number, number, MockError> = AliveChrono.of<number, number, MockError>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

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
            (e: unknown) => {
              spy4();
              expect(e).toBe(error);

              resolve();
            }
          )
        );

        chrono.accept(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });
  });
});
