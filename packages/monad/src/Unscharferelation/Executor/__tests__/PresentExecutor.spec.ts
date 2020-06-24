import sinon, { SinonSpy } from 'sinon';

import { Unscharferelation } from '../../Unscharferelation';
import { PresentExecutor } from '../PresentExecutor';

describe('PresentExecutor', () => {
  describe('onPresent', () => {
    it('T given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: PresentExecutor<number, number> = PresentExecutor.of<number, number>(
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

      await executor.onPresent(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('Promise<T> given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: PresentExecutor<number, number> = PresentExecutor.of<number, number>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

          return Promise.resolve<number>(n - 6);
        },
        (n: number) => {
          spy2();
          expect(n).toBe(value - 6);
        },
        () => {
          spy3();
        }
      );

      await executor.onPresent(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('Unscharferelation.present<T> given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: PresentExecutor<number, number> = PresentExecutor.of<number, number>(
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

      await executor.onPresent(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('null given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: PresentExecutor<number, number> = PresentExecutor.of<number, number>(
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

      await executor.onPresent(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('undefined given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: PresentExecutor<number, number> = PresentExecutor.of<number, number>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

          return undefined;
        },
        () => {
          spy2();
        },
        () => {
          spy3();
        }
      );

      await executor.onPresent(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('Promise<null> given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: PresentExecutor<number, number> = PresentExecutor.of<number, number>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

          return Promise.resolve<null>(null);
        },
        () => {
          spy2();
        },
        () => {
          spy3();
        }
      );

      await executor.onPresent(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('Promise<undefined> given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: PresentExecutor<number, number> = PresentExecutor.of<number, number>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

          return Promise.resolve<undefined>(undefined);
        },
        () => {
          spy2();
        },
        () => {
          spy3();
        }
      );

      await executor.onPresent(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('Unscharferelation.absent given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: PresentExecutor<number, number> = PresentExecutor.of<number, number>(
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

      await executor.onPresent(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
