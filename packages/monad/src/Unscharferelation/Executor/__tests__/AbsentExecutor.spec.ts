import sinon, { SinonSpy } from 'sinon';

import { Unscharferelation } from '../../Unscharferelation';
import { AbsentExecutor } from '../AbsentExecutor';

describe('AbsentExecutor', () => {
  describe('onAbsent', () => {
    it('P given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();

      const executor: AbsentExecutor = AbsentExecutor.of(() => {
        spy1();

        return value;
      });

      await executor.onAbsent();

      expect(spy1.called).toBe(true);
    });

    it('Promise<P> given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();

      const executor: AbsentExecutor = AbsentExecutor.of(() => {
        spy1();

        return Promise.resolve<number>(value);
      });

      await executor.onAbsent();

      expect(spy1.called).toBe(true);
    });

    it('Unscharferelation.present<P> given', async () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();

      const executor: AbsentExecutor = AbsentExecutor.of(() => {
        spy1();

        return Unscharferelation.present<number>(value);
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

    it('Unscharferelation.absent given', async () => {
      const spy1: SinonSpy = sinon.spy();

      const executor: AbsentExecutor = AbsentExecutor.of(() => {
        spy1();

        return Unscharferelation.absent<number>();
      });

      await executor.onAbsent();

      expect(spy1.called).toBe(true);
    });
  });
});
