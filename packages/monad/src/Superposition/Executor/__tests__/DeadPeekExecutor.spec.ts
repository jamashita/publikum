import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';

import { DeadPeekExecutor } from '../DeadPeekExecutor';

describe('DeadPeekExecutor', () => {
  describe('onDead', () => {
    it('sync', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();

      const executor: DeadPeekExecutor<MockError> = DeadPeekExecutor.of<MockError>(() => {
        spy1();
      });

      await executor.onDead(error);

      expect(spy1.called).toBe(true);
    });

    it('async', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();

      // eslint-disable-next-line @typescript-eslint/require-await
      const executor: DeadPeekExecutor<MockError> = DeadPeekExecutor.of<MockError>(async () => {
        spy1();
      });

      await executor.onDead(error);

      expect(spy1.called).toBe(true);
    });
  });
});
