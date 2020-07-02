import sinon, { SinonSpy } from 'sinon';

import { Resolve } from '@jamashita/publikum-type';

import { PassEpoque } from '../../../Epoque/PassEpoque';
import { Absent } from '../../Heisenberg/Absent';
import { Present } from '../../Heisenberg/Present';
import { Unscharferelation } from '../../Unscharferelation';
import { PresentHandler } from '../PresentHandler';

describe('PresentHandler', () => {
  describe('onResolve', () => {
    it('P given', () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const handler: PresentHandler<number, number> = PresentHandler.of<number, number>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

          return n - 6;
        },
        PassEpoque.of<number, void>(
          (n: number) => {
            spy2();
            expect(n).toBe(value - 6);
          },
          () => {
            spy3();
          }
        )
      );

      handler.onResolve(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('Promise<P> given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const handler: PresentHandler<number, number> = PresentHandler.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Promise.resolve<number>(n - 6);
          },
          PassEpoque.of<number, void>(
            (n: number) => {
              spy2();
              expect(n).toBe(value - 6);

              resolve();
            },
            () => {
              spy3();

              resolve();
            }
          )
        );

        handler.onResolve(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('Present Unscharferelation given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const handler: PresentHandler<number, number> = PresentHandler.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Unscharferelation.ofHeisenberg<number>(Present.of<number>(n - 6));
          },
          PassEpoque.of<number, void>(
            (n: number) => {
              spy2();
              expect(n).toBe(value - 6);

              resolve();
            },
            () => {
              spy3();

              resolve();
            }
          )
        );

        handler.onResolve(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('null given', () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const handler: PresentHandler<number, number> = PresentHandler.of<number, number>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

          return null;
        },
        PassEpoque.of<number, void>(
          () => {
            spy2();
          },
          () => {
            spy3();
          }
        )
      );

      handler.onResolve(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('undefined given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const handler: PresentHandler<number, number> = PresentHandler.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return undefined;
          },
          PassEpoque.of<number, void>(
            (n: number) => {
              spy2();
              expect(n).toBe(value - 6);

              resolve();
            },
            () => {
              spy3();

              resolve();
            }
          )
        );

        handler.onResolve(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('Promise<null> given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const handler: PresentHandler<number, number> = PresentHandler.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Promise.resolve<null>(null);
          },
          PassEpoque.of<number, void>(
            (n: number) => {
              spy2();
              expect(n).toBe(value - 6);

              resolve();
            },
            () => {
              spy3();

              resolve();
            }
          )
        );

        handler.onResolve(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('Promise<undefined> given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const handler: PresentHandler<number, number> = PresentHandler.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Promise.resolve<undefined>(undefined);
          },
          PassEpoque.of<number, void>(
            (n: number) => {
              spy2();
              expect(n).toBe(value - 6);

              resolve();
            },
            () => {
              spy3();

              resolve();
            }
          )
        );

        handler.onResolve(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('Absent Unscharferelation given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const handler: PresentHandler<number, number> = PresentHandler.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Unscharferelation.ofHeisenberg<number>(Absent.of<number>());
          },
          PassEpoque.of<number, void>(
            (n: number) => {
              spy2();
              expect(n).toBe(value - 6);

              resolve();
            },
            () => {
              spy3();

              resolve();
            }
          )
        );

        handler.onResolve(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
