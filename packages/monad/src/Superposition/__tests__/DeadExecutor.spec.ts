import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';

import { DeadExecutor } from '../DeadExecutor';
import { Superposition } from '../Superposition';

describe('DeadExecutor', () => {
  describe('onAlive', () => {
    it('is going to execute alive whenever mapper returns anything', async () => {
      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: DeadExecutor<number, MockError> = DeadExecutor.of<number, MockError>(
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

      await executor.onAlive(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('is going to execute alive whenever mapper throws anything', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: DeadExecutor<number, MockError> = DeadExecutor.of<number, MockError>(
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

      await executor.onAlive(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });
  });

  describe('onDead', () => {
    it('T given', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: DeadExecutor<number, MockError> = DeadExecutor.of<number, MockError>(
        (e: MockError) => {
          spy1();
          expect(e).toBe(error);

          return value;
        },
        (n: number) => {
          spy2();
          expect(n).toBe(value);
        },
        () => {
          spy3();
        }
      );

      await executor.onDead(error);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('Promise<T> given', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: DeadExecutor<number, MockError> = DeadExecutor.of<number, MockError>(
        (e: MockError) => {
          spy1();
          expect(e).toBe(error);

          return Promise.resolve<number>(value);
        },
        (n: number) => {
          spy2();
          expect(n).toBe(value);
        },
        () => {
          spy3();
        }
      );

      await executor.onDead(error);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('Superposition.alive<T, E> given', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: DeadExecutor<number, MockError> = DeadExecutor.of<number, MockError>(
        (e: MockError) => {
          spy1();
          expect(e).toBe(error);

          return Superposition.alive<number, MockError>(value);
        },
        (n: number) => {
          spy2();
          expect(n).toBe(value);
        },
        () => {
          spy3();
        }
      );

      await executor.onDead(error);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('E thrown', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: DeadExecutor<number, MockError> = DeadExecutor.of<number, MockError>(
        (e: MockError) => {
          spy1();
          expect(e).toBe(error);

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

      await executor.onDead(error);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('Promise<T> rejected', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: DeadExecutor<number, MockError> = DeadExecutor.of<number, MockError>(
        (e: MockError) => {
          spy1();
          expect(e).toBe(error);

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

      await executor.onDead(error);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('Superposition.dead<T, E> given', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: DeadExecutor<number, MockError> = DeadExecutor.of<number, MockError>(
        (e: MockError) => {
          spy1();
          expect(e).toBe(error);

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

      await executor.onDead(error);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
