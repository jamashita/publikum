import sinon, { SinonSpy } from 'sinon';

import { ResolveConsumerHandler } from '../ResolveConsumerHandler';

describe('ResolveConsumerHandler', () => {
  describe('onResolve', () => {
    it('sync', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();

      const handler: ResolveConsumerHandler<number> = ResolveConsumerHandler.of<number>((n: number) => {
        spy1();
        expect(n).toBe(value);
      });

      await handler.onResolve(value);

      expect(spy1.called).toBe(true);
    });

    it('async', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();

      // eslint-disable-next-line @typescript-eslint/require-await
      const handler: ResolveConsumerHandler<number> = ResolveConsumerHandler.of<number>(async (n: number) => {
        spy1();
        expect(n).toBe(value);
      });

      await handler.onResolve(value);

      expect(spy1.called).toBe(true);
    });
  });
});
