import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';

import { AnyExecutor } from '../AnyExecutor';
import { Superposition } from '../Superposition';

describe('AnyExecutor', () => {
  describe('onAlive', () => {
    it('T given', async () => {
      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const executor: AnyExecutor<number, MockError> = AnyExecutor.of<number, MockError>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

          return n - 3;
        },
        (e: MockError) => {
          spy2();

          throw e;
        },
        (n: number) => {
          spy3();
          expect(n).toBe(value - 3);
        },
        () => {
          spy4();
        }
      );

      await executor.onAlive(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('Promise<T> given', async () => {
      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const executor: AnyExecutor<number, MockError> = AnyExecutor.of<number, MockError>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

          return Promise.resolve<number>(n - 3);
        },
        (e: MockError) => {
          spy2();

          throw e;
        },
        (n: number) => {
          spy3();
          expect(n).toBe(value - 3);
        },
        () => {
          spy4();
        }
      );

      await executor.onAlive(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('Superposition.alive<T, E> given', async () => {
      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const executor: AnyExecutor<number, MockError> = AnyExecutor.of<number, MockError>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

          return Superposition.alive<number, MockError>(n - 3);
        },
        (e: MockError) => {
          spy2();

          throw e;
        },
        (n: number) => {
          spy3();
          expect(n).toBe(value - 3);
        },
        () => {
          spy4();
        }
      );

      await executor.onAlive(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('E thrown', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const executor: AnyExecutor<number, MockError> = AnyExecutor.of<number, MockError>(
        () => {
          spy1();

          throw error;
        },
        () => {
          spy2();

          return value;
        },
        () => {
          spy3();
        },
        (e: MockError) => {
          spy4();
          expect(e).toBe(error);
        }
      );

      await executor.onAlive(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('Promise<T> rejected', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const executor: AnyExecutor<number, MockError> = AnyExecutor.of<number, MockError>(
        () => {
          spy1();

          return Promise.reject(error);
        },
        () => {
          spy2();

          return value;
        },
        () => {
          spy3();
        },
        (e: MockError) => {
          spy4();
          expect(e).toBe(error);
        }
      );

      await executor.onAlive(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('Superposition.dead<T, E> given', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const executor: AnyExecutor<number, MockError> = AnyExecutor.of<number, MockError>(
        () => {
          spy1();

          return Superposition.dead(error);
        },
        () => {
          spy2();

          return value;
        },
        () => {
          spy3();
        },
        (e: MockError) => {
          spy4();
          expect(e).toBe(error);
        }
      );

      await executor.onAlive(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });
  });

  describe('onDead', () => {
    it('T given', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const executor: AnyExecutor<number, MockError> = AnyExecutor.of<number, MockError>(
        () => {
          spy1();

          throw error;
        },
        (e: MockError) => {
          spy2();
          expect(e).toBe(error);

          return value;
        },
        (n: number) => {
          spy3();
          expect(n).toBe(value);
        },
        () => {
          spy4();
        }
      );

      await executor.onDead(error);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('Promise<T> given', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const executor: AnyExecutor<number, MockError> = AnyExecutor.of<number, MockError>(
        () => {
          spy1();

          throw error;
        },
        (e: MockError) => {
          spy2();
          expect(e).toBe(error);

          return Promise.resolve<number>(value - 4);
        },
        (n: number) => {
          spy3();
          expect(n).toBe(value - 4);
        },
        () => {
          spy4();
        }
      );

      await executor.onDead(error);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('Superposition.alive<T, E> given', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const executor: AnyExecutor<number, MockError> = AnyExecutor.of<number, MockError>(
        () => {
          spy1();

          throw error;
        },
        (e: MockError) => {
          spy2();
          expect(e).toBe(error);

          return Superposition.alive<number, MockError>(value - 4);
        },
        (n: number) => {
          spy3();
          expect(n).toBe(value - 4);
        },
        () => {
          spy4();
        }
      );

      await executor.onDead(error);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('E thrown', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const executor: AnyExecutor<number, MockError> = AnyExecutor.of<number, MockError>(
        (n: number) => {
          spy1();

          return n - 4;
        },
        (e: MockError) => {
          spy2();
          expect(e).toBe(error);

          throw error;
        },
        () => {
          spy3();
        },
        (e: MockError) => {
          spy4();
          expect(e).toBe(error);
        }
      );

      await executor.onDead(error);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('Promise<T> rejected', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const executor: AnyExecutor<number, MockError> = AnyExecutor.of<number, MockError>(
        (n: number) => {
          spy1();

          return n - 4;
        },
        (e: MockError) => {
          spy2();
          expect(e).toBe(error);

          return Promise.reject<number>(error);
        },
        () => {
          spy3();
        },
        (e: MockError) => {
          spy4();
          expect(e).toBe(error);
        }
      );

      await executor.onDead(error);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('Superposition.dead<T, E> given', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const executor: AnyExecutor<number, MockError> = AnyExecutor.of<number, MockError>(
        (n: number) => {
          spy1();

          return n - 4;
        },
        (e: MockError) => {
          spy2();
          expect(e).toBe(error);

          return Superposition.dead<number, MockError>(error);
        },
        () => {
          spy3();
        },
        (e: MockError) => {
          spy4();
          expect(e).toBe(error);
        }
      );

      await executor.onDead(error);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
      expect(spy4.called).toBe(true);
    });
  });
});
