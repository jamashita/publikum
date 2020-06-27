import sinon, { SinonSpy } from 'sinon';

import { ResolveConsumerExecutor } from '../ResolveConsumerExecutor';

describe('ResolveConsumerExecutor', () => {
  describe('onResolve', () => {
    it('sync', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();

      const executor: ResolveConsumerExecutor<number> = ResolveConsumerExecutor.of<number>((n: number) => {
        spy1();
        expect(n).toBe(value);
      });

      await executor.onResolve(value);

      expect(spy1.called).toBe(true);
    });

    it('async', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();

      // eslint-disable-next-line @typescript-eslint/require-await
      const executor: ResolveConsumerExecutor<number> = ResolveConsumerExecutor.of<number>(async (n: number) => {
        spy1();
        expect(n).toBe(value);
      });

      await executor.onResolve(value);

      expect(spy1.called).toBe(true);
    });
  });
});
