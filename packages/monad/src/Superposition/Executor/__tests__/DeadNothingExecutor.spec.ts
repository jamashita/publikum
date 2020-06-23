import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';

import { DeadNothingExecutor } from '../DeadNothingExecutor';

describe('DeadNothingExecutor', () => {
  describe('onDead', () => {
    it('sync', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();

      const executor: DeadNothingExecutor<MockError> = DeadNothingExecutor.of<MockError>((e: MockError) => {
        spy1();
        expect(e).toBe(error);
      });

      await executor.onDead(error);

      expect(spy1.called).toBe(true);
    });

    it('async', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();

      // eslint-disable-next-line @typescript-eslint/require-await
      const executor: DeadNothingExecutor<MockError> = DeadNothingExecutor.of<MockError>(async (e: MockError) => {
        spy1();
        expect(e).toBe(error);
      });

      await executor.onDead(error);

      expect(spy1.called).toBe(true);
    });

    it('sync error', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();

      const executor: DeadNothingExecutor<MockError> = DeadNothingExecutor.of<MockError>((e: MockError) => {
        spy1();
        expect(e).toBe(error);

        throw error;
      });

      await executor.onDead(error);

      expect(spy1.called).toBe(true);
    });

    it('async error', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();

      // eslint-disable-next-line @typescript-eslint/require-await
      const executor: DeadNothingExecutor<MockError> = DeadNothingExecutor.of<MockError>(async (e: MockError) => {
        spy1();
        expect(e).toBe(error);

        return Promise.reject<number>(error);
      });

      await executor.onDead(error);

      expect(spy1.called).toBe(true);
    });
  });
});
