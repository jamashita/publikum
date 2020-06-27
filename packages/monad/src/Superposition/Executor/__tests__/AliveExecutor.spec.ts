import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';

import { Superposition } from '../../Superposition';
import { AliveExecutor } from '../AliveExecutor';

describe('AliveExecutor', () => {
  describe('onResolve', () => {
    it('A given', async () => {
      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: AliveExecutor<number, number, MockError> = AliveExecutor.of<number, number, MockError>(
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

      await executor.onResolve(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('Promise<A> given', async () => {
      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: AliveExecutor<number, number, MockError> = AliveExecutor.of<number, number, MockError>(
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

      await executor.onResolve(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('Superposition.alive<A, D> given', async () => {
      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: AliveExecutor<number, number, MockError> = AliveExecutor.of<number, number, MockError>(
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

      await executor.onResolve(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('D thrown', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: AliveExecutor<number, number, MockError> = AliveExecutor.of<number, number, MockError>(
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

      await executor.onResolve(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('Promise<A> rejected', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: AliveExecutor<number, number, MockError> = AliveExecutor.of<number, number, MockError>(
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

      await executor.onResolve(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('Superposition.dead<A, D> given', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const executor: AliveExecutor<number, number, MockError> = AliveExecutor.of<number, number, MockError>(
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

      await executor.onResolve(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
