import sinon, { SinonSpy } from 'sinon';

import { PresentNothingExecutor } from '../PresentNothingExecutor';

describe('PresentNothingExecutor', () => {
  describe('onPresent', () => {
    it('sync', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();

      const executor: PresentNothingExecutor<number> = PresentNothingExecutor.of<number>((n: number) => {
        spy1();
        expect(n).toBe(value);
      });

      await executor.onPresent(value);

      expect(spy1.called).toBe(true);
    });

    it('async', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();

      // eslint-disable-next-line @typescript-eslint/require-await
      const executor: PresentNothingExecutor<number> = PresentNothingExecutor.of<number>(async (n: number) => {
        spy1();
        expect(n).toBe(value);
      });

      await executor.onPresent(value);

      expect(spy1.called).toBe(true);
    });
  });
});
