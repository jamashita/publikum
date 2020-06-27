import sinon, { SinonSpy } from 'sinon';

import { RejectConsumerHandler } from '../RejectConsumerHandler';

describe('RejectConsumerHandler', () => {
  describe('onReject', () => {
    it('sync', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();

      const handler: RejectConsumerHandler<number> = RejectConsumerHandler.of<number>((n: number) => {
        spy1();
        expect(n).toBe(value);
      });

      await handler.onReject(value);

      expect(spy1.called).toBe(true);
    });

    it('async', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();

      // eslint-disable-next-line @typescript-eslint/require-await
      const handler: RejectConsumerHandler<number> = RejectConsumerHandler.of<number>(async (n: number) => {
        spy1();
        expect(n).toBe(value);
      });

      await handler.onReject(value);

      expect(spy1.called).toBe(true);
    });
  });
});
