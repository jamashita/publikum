import sinon, { SinonSpy } from 'sinon';

import { RejectConsumerExecutor } from '../RejectConsumerExecutor';

describe('RejectConsumerExecutor', () => {
  describe('onReject', () => {
    it('sync', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();

      const executor: RejectConsumerExecutor<number> = RejectConsumerExecutor.of<number>((n: number) => {
        spy1();
        expect(n).toBe(value);
      });

      await executor.onReject(value);

      expect(spy1.called).toBe(true);
    });

    it('async', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();

      // eslint-disable-next-line @typescript-eslint/require-await
      const executor: RejectConsumerExecutor<number> = RejectConsumerExecutor.of<number>(async (n: number) => {
        spy1();
        expect(n).toBe(value);
      });

      await executor.onReject(value);

      expect(spy1.called).toBe(true);
    });
  });
});
