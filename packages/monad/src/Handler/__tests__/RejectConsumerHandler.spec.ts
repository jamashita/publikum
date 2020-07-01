import sinon, { SinonSpy } from 'sinon';

import { RejectEpoque } from '../../Epoque/Interface/RejectEpoque';
import { PassEpoque } from '../../Epoque/PassEpoque';
import { RejectConsumerHandler } from '../RejectConsumerHandler';

describe('RejectConsumerHandler', () => {
  describe('onReject', () => {
    it('sync', () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const epoque: RejectEpoque<number> = PassEpoque.of<unknown, number>(
        () => {
          spy1();
        },
        (n: number) => {
          spy2();
          expect(n).toBe(value);
        }
      );
      const handler: RejectConsumerHandler<number> = RejectConsumerHandler.of<number>(epoque);

      handler.onReject(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('async', () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const epoque: RejectEpoque<number> = PassEpoque.of<unknown, number>(
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          spy1();
        },
        // eslint-disable-next-line @typescript-eslint/require-await
        async (n: number) => {
          spy2();
          expect(n).toBe(value);
        }
      );
      const handler: RejectConsumerHandler<number> = RejectConsumerHandler.of<number>(epoque);

      handler.onReject(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
