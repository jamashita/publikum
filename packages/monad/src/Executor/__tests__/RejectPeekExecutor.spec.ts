import sinon, { SinonSpy } from 'sinon';

import { RejectPeekExecutor } from '../RejectPeekExecutor';

describe('RejectPeekExecutor', () => {
  describe('onReject', () => {
    it('sync', async () => {
      const spy1: SinonSpy = sinon.spy();

      const executor: RejectPeekExecutor<void> = RejectPeekExecutor.of<void>(() => {
        spy1();
      });

      await executor.onReject();

      expect(spy1.called).toBe(true);
    });

    it('async', async () => {
      const spy1: SinonSpy = sinon.spy();

      // eslint-disable-next-line @typescript-eslint/require-await
      const executor: RejectPeekExecutor<void> = RejectPeekExecutor.of<void>(async () => {
        spy1();
      });

      await executor.onReject();

      expect(spy1.called).toBe(true);
    });
  });
});
