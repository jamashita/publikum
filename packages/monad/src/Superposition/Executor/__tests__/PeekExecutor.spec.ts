import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';

import { PeekExecutor } from '../PeekExecutor';

describe('PeekExecutor', () => {
  describe('onAlive', () => {
    it('sync', async () => {
      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();

      const executor: PeekExecutor<number, MockError> = PeekExecutor.of<number, MockError>(() => {
        spy1();
      });

      await executor.onAlive(value);

      expect(spy1.called).toBe(true);
    });

    it('async', async () => {
      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();

      // eslint-disable-next-line @typescript-eslint/require-await
      const executor: PeekExecutor<number, MockError> = PeekExecutor.of<number, MockError>(async () => {
        spy1();
      });

      await executor.onAlive(value);

      expect(spy1.called).toBe(true);
    });
  });

  describe('onDead', () => {
    it('sync', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();

      const executor: PeekExecutor<number, MockError> = PeekExecutor.of<number, MockError>(() => {
        spy1();
      });

      await executor.onDead(error);

      expect(spy1.called).toBe(true);
    });

    it('async', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();

      // eslint-disable-next-line @typescript-eslint/require-await
      const executor: PeekExecutor<number, MockError> = PeekExecutor.of<number, MockError>(async () => {
        spy1();
      });

      await executor.onDead(error);

      expect(spy1.called).toBe(true);
    });
  });
});
