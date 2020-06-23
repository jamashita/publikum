import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';

import { AliveExecutor } from '../AliveExecutor';
import { Superposition } from '../Superposition';

describe('AliveExecutor', () => {
  describe('onAlive', () => {
    it('T given', async () => {
      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: AliveExecutor<number, MockError> = AliveExecutor.of<number, MockError>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

          return n - 1;
        },
        (n: number) => {
          spy2();
          expect(n).toBe(value - 1);
        },
        () => {
          spy3();
        }
      );

      await executor.onAlive(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('Promise<T> given', async () => {
      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: AliveExecutor<number, MockError> = AliveExecutor.of<number, MockError>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

          return Promise.resolve<number>(n - 2);
        },
        (n: number) => {
          spy2();
          expect(n).toBe(value - 2);
        },
        () => {
          spy3();
        }
      );

      await executor.onAlive(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('Superposition.alive<T, E> given', async () => {
      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: AliveExecutor<number, MockError> = AliveExecutor.of<number, MockError>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

          return Superposition.alive<number, MockError>(n - 3);
        },
        (n: number) => {
          spy2();
          expect(n).toBe(value - 3);
        },
        () => {
          spy3();
        }
      );

      await executor.onAlive(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('E thrown', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: AliveExecutor<number, MockError> = AliveExecutor.of<number, MockError>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

          throw error;
        },
        () => {
          spy2();
        },
        (e: MockError) => {
          spy3();
          expect(e).toBe(error);
        }
      );

      await executor.onAlive(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('Promise<T> rejected', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: AliveExecutor<number, MockError> = AliveExecutor.of<number, MockError>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

          return Promise.reject<number>(error);
        },
        () => {
          spy2();
        },
        (e: MockError) => {
          spy3();
          expect(e).toBe(error);
        }
      );

      await executor.onAlive(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('Superposition.dead<T, E> given', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: AliveExecutor<number, MockError> = AliveExecutor.of<number, MockError>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

          return Superposition.dead<number, MockError>(error);
        },
        () => {
          spy2();
        },
        (e: MockError) => {
          spy3();
          expect(e).toBe(error);
        }
      );

      await executor.onAlive(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });

  describe('onDead', () => {
    it('is going to execute dead whenever mapper returns anything', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: AliveExecutor<number, MockError> = AliveExecutor.of<number, MockError>(
        () => {
          spy1();

          return value;
        },
        () => {
          spy2();
        },
        () => {
          spy3();
        }
      );

      await executor.onDead(error);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('is going to execute dead whenever mapper throws anything', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: AliveExecutor<number, MockError> = AliveExecutor.of<number, MockError>(
        () => {
          spy1();

          throw error;
        },
        () => {
          spy2();
        },
        () => {
          spy3();
        }
      );

      await executor.onDead(error);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
