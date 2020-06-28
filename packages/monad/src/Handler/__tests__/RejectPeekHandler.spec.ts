import sinon, { SinonSpy } from 'sinon';

import { RejectPeekHandler } from '../RejectPeekHandler';

describe('RejectPeekHandler', () => {
  describe('onReject', () => {
    it('sync', () => {
      const spy1: SinonSpy = sinon.spy();

      const handler: RejectPeekHandler<void> = RejectPeekHandler.of<void>(() => {
        spy1();
      });

      handler.onReject();

      expect(spy1.called).toBe(true);
    });

    it('async', () => {
      const spy1: SinonSpy = sinon.spy();

      // eslint-disable-next-line @typescript-eslint/require-await
      const handler: RejectPeekHandler<void> = RejectPeekHandler.of<void>(async () => {
        spy1();
      });

      handler.onReject();

      expect(spy1.called).toBe(true);
    });
  });
});
