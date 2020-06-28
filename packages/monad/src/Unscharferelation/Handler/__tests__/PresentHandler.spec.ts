import sinon, { SinonSpy } from 'sinon';

import { Resolve } from '@jamashita/publikum-type';

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
        (n: number) => {
          spy2();
          expect(n).toBe(value - 6);
        },
        () => {
          spy3();
        }
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
          (n: number) => {
            spy2();
            expect(n).toBe(value - 6);

            resolve();
          },
          () => {
            spy3();

            resolve();
          }
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

      const handler: PresentHandler<number, number> = PresentHandler.of<number, number>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

          return Unscharferelation.present<number>(n - 6);
        },
        (n: number) => {
          spy2();
          expect(n).toBe(value - 6);
        },
        () => {
          spy3();
        }
      );

      await handler.onResolve(value);

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
        () => {
          spy2();
        },
        () => {
          spy3();
        }
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
          (n: number) => {
            spy2();
            expect(n).toBe(value - 6);

            resolve();
          },
          () => {
            spy3();

            resolve();
          }
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
          (n: number) => {
            spy2();
            expect(n).toBe(value - 6);

            resolve();
          },
          () => {
            spy3();

            resolve();
          }
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
          (n: number) => {
            spy2();
            expect(n).toBe(value - 6);

            resolve();
          },
          () => {
            spy3();

            resolve();
          }
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

      const handler: PresentHandler<number, number> = PresentHandler.of<number, number>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

          return Unscharferelation.absent<number>();
        },
        () => {
          spy2();
        },
        () => {
          spy3();
        }
      );

      await handler.onResolve(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
