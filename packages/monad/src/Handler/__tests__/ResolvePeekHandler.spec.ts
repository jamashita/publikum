import sinon, { SinonSpy } from 'sinon';

import { ResolvePeekHandler } from '../ResolvePeekHandler';

describe('ResolvePeekHandler', () => {
  describe('onResolve', () => {
    it('sync', () => {
      const spy1: SinonSpy = sinon.spy();

      const handler: ResolvePeekHandler<void> = ResolvePeekHandler.of<void>(() => {
        spy1();
      });

      handler.onResolve();

      expect(spy1.called).toBe(true);
    });

    it('async', () => {
      const spy1: SinonSpy = sinon.spy();

      // eslint-disable-next-line @typescript-eslint/require-await
      const handler: ResolvePeekHandler<void> = ResolvePeekHandler.of<void>(async () => {
        spy1();
      });

      handler.onResolve();

      expect(spy1.called).toBe(true);
    });
  });
});
