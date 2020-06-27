import sinon, { SinonSpy } from 'sinon';

import { ResolvePeekExecutor } from '../ResolvePeekExecutor';

describe('ResolvePeekExecutor', () => {
  describe('onResolve', () => {
    it('sync', async () => {
      const spy1: SinonSpy = sinon.spy();

      const executor: ResolvePeekExecutor<void> = ResolvePeekExecutor.of<void>(() => {
        spy1();
      });

      await executor.onResolve();

      expect(spy1.called).toBe(true);
    });

    it('async', async () => {
      const spy1: SinonSpy = sinon.spy();

      // eslint-disable-next-line @typescript-eslint/require-await
      const executor: ResolvePeekExecutor<void> = ResolvePeekExecutor.of<void>(async () => {
        spy1();
      });

      await executor.onResolve();

      expect(spy1.called).toBe(true);
    });
  });
});
