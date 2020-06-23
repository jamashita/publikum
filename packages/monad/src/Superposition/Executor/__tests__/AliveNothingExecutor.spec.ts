import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';

import { AliveNothingExecutor } from '../AliveNothingExecutor';

describe('AliveNothingExecutor', () => {
  describe('onAlive', () => {
    it('sync', async () => {
      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();

      const executor: AliveNothingExecutor<number> = AliveNothingExecutor.of<number>((n: number) => {
        spy1();
        expect(n).toBe(value);
      });

      await executor.onAlive(value);

      expect(spy1.called).toBe(true);
    });

    it('async', async () => {
      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();

      // eslint-disable-next-line @typescript-eslint/require-await
      const executor: AliveNothingExecutor<number> = AliveNothingExecutor.of<number>(async (n: number) => {
        spy1();
        expect(n).toBe(value);
      });

      await executor.onAlive(value);

      expect(spy1.called).toBe(true);
    });

    it('sync error', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();

      const executor: AliveNothingExecutor<number> = AliveNothingExecutor.of<number>((n: number) => {
        spy1();
        expect(n).toBe(value);

        throw error;
      });

      await executor.onAlive(value);

      expect(spy1.called).toBe(true);
    });

    it('async error', async () => {
      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();

      // eslint-disable-next-line @typescript-eslint/require-await
      const executor: AliveNothingExecutor<number> = AliveNothingExecutor.of<number>(async (n: number) => {
        spy1();
        expect(n).toBe(value);
      });

      await executor.onAlive(value);

      expect(spy1.called).toBe(true);
    });
  });
});
