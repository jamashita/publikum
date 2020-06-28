import sinon, { SinonSpy } from 'sinon';

import { Resolve } from '@jamashita/publikum-type';

import { Absent } from '../../Absent';
import { Present } from '../../Present';
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
        (n: number) => {
          spy2();
          expect(n).toBe(value - 6);
        },
        () => {
          spy3();
        }
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

        handler.onReject();
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('Present Unscharferelation given', () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const handler: AbsentHandler<number> = AbsentHandler.of<number>(
        () => {
          spy1();

          return Unscharferelation.ofHeisenberg<number>(Present.of<number>(value - 6));
        },
        (n: number) => {
          spy2();
          expect(n).toBe(value - 6);
        },
        () => {
          spy3();
        }
      );

      handler.onReject();

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
          () => {
            spy2();

            resolve();
          },
          () => {
            spy3();

            resolve();
          }
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
          () => {
            spy2();

            resolve();
          },
          () => {
            spy3();

            resolve();
          }
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
          () => {
            spy2();

            resolve();
          },
          () => {
            spy3();

            resolve();
          }
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
          () => {
            spy2();

            resolve();
          },
          () => {
            spy3();

            resolve();
          }
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

      const handler: AbsentHandler<number> = AbsentHandler.of<number>(
        () => {
          spy1();

          return Unscharferelation.ofHeisenberg<number>(Absent.of<number>());
        },
        () => {
          spy2();
        },
        () => {
          spy3();
        }
      );

      await handler.onReject();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
