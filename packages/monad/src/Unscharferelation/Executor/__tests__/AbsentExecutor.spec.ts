import sinon, { SinonSpy } from 'sinon';

import { Unscharferelation } from '../../Unscharferelation';
import { AbsentExecutor } from '../AbsentExecutor';

describe('AbsentExecutor', () => {
  describe('onReject', () => {
    it('P given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: AbsentExecutor<number> = AbsentExecutor.of<number>(
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

      await executor.onReject();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('Promise<P> given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: AbsentExecutor<number> = AbsentExecutor.of<number>(
        () => {
          spy1();

          return Promise.resolve<number>(value - 6);
        },
        (n: number) => {
          spy2();
          expect(n).toBe(value - 6);
        },
        () => {
          spy3();
        }
      );

      await executor.onReject();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('Unscharferelation.present<P> given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: AbsentExecutor<number> = AbsentExecutor.of<number>(
        () => {
          spy1();

          return Unscharferelation.present<number>(value - 6);
        },
        (n: number) => {
          spy2();
          expect(n).toBe(value - 6);
        },
        () => {
          spy3();
        }
      );

      await executor.onReject();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('null given', async () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: AbsentExecutor<number> = AbsentExecutor.of<number>(
        () => {
          spy1();

          return null;
        },
        () => {
          spy2();
        },
        () => {
          spy3();
        }
      );

      await executor.onReject();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('undefined given', async () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: AbsentExecutor<number> = AbsentExecutor.of<number>(
        () => {
          spy1();

          return undefined;
        },
        () => {
          spy2();
        },
        () => {
          spy3();
        }
      );

      await executor.onReject();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('Promise<null> given', async () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: AbsentExecutor<number> = AbsentExecutor.of<number>(
        () => {
          spy1();

          return Promise.resolve<null>(null);
        },
        () => {
          spy2();
        },
        () => {
          spy3();
        }
      );

      await executor.onReject();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('Promise<undefined> given', async () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: AbsentExecutor<number> = AbsentExecutor.of<number>(
        () => {
          spy1();

          return Promise.resolve<undefined>(undefined);
        },
        () => {
          spy2();
        },
        () => {
          spy3();
        }
      );

      await executor.onReject();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('Unscharferelation.absent given', async () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: AbsentExecutor<number> = AbsentExecutor.of<number>(
        () => {
          spy1();

          return Unscharferelation.absent<number>();
        },
        () => {
          spy2();
        },
        () => {
          spy3();
        }
      );

      await executor.onReject();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
