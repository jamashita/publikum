import sinon, { SinonSpy } from 'sinon';

import { Quantization } from '../../Quantization';
import { AbsentExecutor } from '../AbsentExecutor';

describe('AbsentExecutor', () => {
  describe('onAbsent', () => {
    it('T given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();

      const executor: AbsentExecutor = AbsentExecutor.of(() => {
        spy1();

        return value;
      });

      await executor.onAbsent();

      expect(spy1.called).toBe(true);
    });

    it('Promise<T> given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();

      const executor: AbsentExecutor = AbsentExecutor.of(() => {
        spy1();

        return Promise.resolve<number>(value);
      });

      await executor.onAbsent();

      expect(spy1.called).toBe(true);
    });

    it('Quantization.present<T> given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();

      const executor: AbsentExecutor = AbsentExecutor.of(() => {
        spy1();

        return Quantization.present<number>(value);
      });

      await executor.onAbsent();

      expect(spy1.called).toBe(true);
    });

    it('null given', async () => {
      const spy1: SinonSpy = sinon.spy();

      const executor: AbsentExecutor = AbsentExecutor.of(() => {
        spy1();

        return null;
      });

      await executor.onAbsent();

      expect(spy1.called).toBe(true);
    });

    it('undefined given', async () => {
      const spy1: SinonSpy = sinon.spy();

      const executor: AbsentExecutor = AbsentExecutor.of(() => {
        spy1();

        return undefined;
      });

      await executor.onAbsent();

      expect(spy1.called).toBe(true);
    });

    it('Promise<null> given', async () => {
      const spy1: SinonSpy = sinon.spy();

      const executor: AbsentExecutor = AbsentExecutor.of(() => {
        spy1();

        return Promise.resolve<null>(null);
      });

      await executor.onAbsent();

      expect(spy1.called).toBe(true);
    });

    it('Promise<undefined> given', async () => {
      const spy1: SinonSpy = sinon.spy();

      const executor: AbsentExecutor = AbsentExecutor.of(() => {
        spy1();

        return Promise.resolve<undefined>(undefined);
      });

      await executor.onAbsent();

      expect(spy1.called).toBe(true);
    });

    it('Quantization.absent given', async () => {
      const spy1: SinonSpy = sinon.spy();

      const executor: AbsentExecutor = AbsentExecutor.of(() => {
        spy1();

        return Quantization.absent<number>();
      });

      await executor.onAbsent();

      expect(spy1.called).toBe(true);
    });
  });
});
