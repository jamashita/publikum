import sinon, { SinonSpy } from 'sinon';

import { Resolve } from '@jamashita/publikum-type';

import { PassEpoque } from '../../../Epoque/PassEpoque';
import { Absent } from '../../Heisenberg/Absent';
import { Present } from '../../Heisenberg/Present';
import { Unscharferelation } from '../../Unscharferelation';
import { AbsentHandler } from '../AbsentHandler';

describe('AbsentHandler', () => {
  describe('onReject', () => {
    it('P given', () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const handler: AbsentHandler<number> = AbsentHandler.of<number>(
        () => {
          spy1();

          return value - 6;
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

      handler.onReject();

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
        const handler: AbsentHandler<number> = AbsentHandler.of<number>(
          () => {
            spy1();

            return Promise.resolve<number>(value - 6);
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

        handler.onReject();
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
        const handler: AbsentHandler<number> = AbsentHandler.of<number>(
          () => {
            spy1();

            return Unscharferelation.ofHeisenberg<number>(Present.of<number>(value - 6));
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

        handler.onReject();
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('null given', async () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const handler: AbsentHandler<number> = AbsentHandler.of<number>(
          () => {
            spy1();

            return null;
          },
          PassEpoque.of<number, void>(
            () => {
              spy2();

              resolve();
            },
            () => {
              spy3();

              resolve();
            }
          )
        );

        handler.onReject();
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('undefined given', async () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const handler: AbsentHandler<number> = AbsentHandler.of<number>(
          () => {
            spy1();

            return null;
          },
          PassEpoque.of<number, void>(
            () => {
              spy2();

              resolve();
            },
            () => {
              spy3();

              resolve();
            }
          )
        );

        handler.onReject();
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('Promise<null> given', async () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const handler: AbsentHandler<number> = AbsentHandler.of<number>(
          () => {
            spy1();

            return Promise.resolve<null>(null);
          },
          PassEpoque.of<number, void>(
            () => {
              spy2();

              resolve();
            },
            () => {
              spy3();

              resolve();
            }
          )
        );

        handler.onReject();
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('Promise<undefined> given', async () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const handler: AbsentHandler<number> = AbsentHandler.of<number>(
          () => {
            spy1();

            return Promise.resolve<undefined>(undefined);
          },
          PassEpoque.of<number, void>(
            () => {
              spy2();

              resolve();
            },
            () => {
              spy3();

              resolve();
            }
          )
        );

        handler.onReject();
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('Absent Unscharferelation given', async () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const handler: AbsentHandler<number> = AbsentHandler.of<number>(
          () => {
            spy1();

            return Unscharferelation.ofHeisenberg<number>(Absent.of<number>());
          },
          PassEpoque.of<number, void>(
            () => {
              spy2();

              resolve();
            },
            () => {
              spy3();

              resolve();
            }
          )
        );

        handler.onReject();
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
