import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';

import { Superposition } from '../../Superposition';
import { DeadExecutor } from '../DeadExecutor';

describe('DeadExecutor', () => {
  describe('onDead', () => {
    it('A given', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: DeadExecutor<number, MockError, MockError> = DeadExecutor.of<number, MockError, MockError>(
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

    it('Promise<A> given', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: DeadExecutor<number, MockError, MockError> = DeadExecutor.of<number, MockError, MockError>(
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

    it('Superposition.alive<A, D> given', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: DeadExecutor<number, MockError, MockError> = DeadExecutor.of<number, MockError, MockError>(
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

    it('D thrown', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: DeadExecutor<number, MockError, MockError> = DeadExecutor.of<number, MockError, MockError>(
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

    it('Promise<A> rejected', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: DeadExecutor<number, MockError, MockError> = DeadExecutor.of<number, MockError, MockError>(
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

    it('Superposition.dead<A, D> given', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: DeadExecutor<number, MockError, MockError> = DeadExecutor.of<number, MockError, MockError>(
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
