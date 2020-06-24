import sinon, { SinonSpy } from 'sinon';

import { AbsentNothingExecutor } from '../AbsentNothingExecutor';

describe('AbsentNothingExecutor', () => {
  describe('onAbsent', () => {
    it('sync', async () => {
      const spy1: SinonSpy = sinon.spy();

      const executor: AbsentNothingExecutor = AbsentNothingExecutor.of(() => {
        spy1();
      });

      await executor.onAbsent();

      expect(spy1.called).toBe(true);
    });

    it('async', async () => {
      const spy1: SinonSpy = sinon.spy();

      // eslint-disable-next-line @typescript-eslint/require-await
      const executor: AbsentNothingExecutor = AbsentNothingExecutor.of(async () => {
        spy1();
      });

      await executor.onAbsent();

      expect(spy1.called).toBe(true);
    });
  });
});
