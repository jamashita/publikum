import sinon, { SinonSpy } from 'sinon';

import { PeekExecutor } from '../PeekExecutor';

describe('PeekExecutor', () => {
  describe('onPresent', () => {
    it('sync', async () => {
      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();

      const executor: PeekExecutor<number> = PeekExecutor.of<number>(() => {
        spy1();
      });

      await executor.onPresent(value);

      expect(spy1.called).toBe(true);
    });

    it('async', async () => {
      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();

      // eslint-disable-next-line @typescript-eslint/require-await
      const executor: PeekExecutor<number> = PeekExecutor.of<number>(async () => {
        spy1();
      });

      await executor.onPresent(value);

      expect(spy1.called).toBe(true);
    });
  });

  describe('onAbsent', () => {
    it('sync', async () => {
      const spy1: SinonSpy = sinon.spy();

      const executor: PeekExecutor<number> = PeekExecutor.of<number>(() => {
        spy1();
      });

      await executor.onAbsent();

      expect(spy1.called).toBe(true);
    });

    it('async', async () => {
      const spy1: SinonSpy = sinon.spy();

      // eslint-disable-next-line @typescript-eslint/require-await
      const executor: PeekExecutor<number> = PeekExecutor.of<number>(async () => {
        spy1();
      });

      await executor.onAbsent();

      expect(spy1.called).toBe(true);
    });
  });
});
