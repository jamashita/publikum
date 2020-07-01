import sinon, { SinonSpy } from 'sinon';

import { RejectEpoque } from '../../Epoque/Interface/RejectEpoque';
import { PassEpoque } from '../../Epoque/PassEpoque';
import { RejectPeekHandler } from '../RejectPeekHandler';

describe('RejectPeekHandler', () => {
  describe('onReject', () => {
    it('sync', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const epoque: RejectEpoque<void> = PassEpoque.of<unknown, void>(
        () => {
          spy1();
        },
        () => {
          spy2();
        }
      );
      const handler: RejectPeekHandler = RejectPeekHandler.of(epoque);

      handler.onReject();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('async', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const epoque: RejectEpoque<void> = PassEpoque.of<unknown, void>(
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          spy1();
        },
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          spy2();
        }
      );
      const handler: RejectPeekHandler = RejectPeekHandler.of(epoque);

      handler.onReject();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
