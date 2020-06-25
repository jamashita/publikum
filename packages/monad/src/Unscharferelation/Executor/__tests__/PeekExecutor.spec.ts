import sinon, { SinonSpy } from 'sinon';

import { PeekExecutor } from '../PeekExecutor';

describe('PeekExecutor', () => {
  describe('onPresent', () => {
    it('sync', async () => {
      const spy1: SinonSpy = sinon.spy();

      const executor: PeekExecutor = PeekExecutor.of(() => {
        spy1();
      });

      await executor.onPresent();

      expect(spy1.called).toBe(true);
    });

    it('async', async () => {
      const spy1: SinonSpy = sinon.spy();

      // eslint-disable-next-line @typescript-eslint/require-await
      const executor: PeekExecutor = PeekExecutor.of(async () => {
        spy1();
      });

      await executor.onPresent();

      expect(spy1.called).toBe(true);
    });
  });

  describe('onAbsent', () => {
    it('sync', async () => {
      const spy1: SinonSpy = sinon.spy();

      const executor: PeekExecutor = PeekExecutor.of(() => {
        spy1();
      });

      await executor.onAbsent();

      expect(spy1.called).toBe(true);
    });

    it('async', async () => {
      const spy1: SinonSpy = sinon.spy();

      // eslint-disable-next-line @typescript-eslint/require-await
      const executor: PeekExecutor = PeekExecutor.of(async () => {
        spy1();
      });

      await executor.onAbsent();

      expect(spy1.called).toBe(true);
    });
  });
});
