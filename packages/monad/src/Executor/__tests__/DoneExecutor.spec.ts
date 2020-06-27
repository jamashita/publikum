import sinon, { SinonSpy } from 'sinon';

import { DoneExecutor } from '../DoneExecutor';
import { IRejectExecutor } from '../Interface/IRejectExecutor';
import { IResolveExecutor } from '../Interface/IResolveExecutor';
import { MockRejectExecutor } from '../Mock/MockRejectExecutor';
import { MockResolveExecutor } from '../Mock/MockResolveExecutor';

describe('DoneExecutor', () => {
  describe('onResolve', () => {
    it('normal case', async () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const resolve: IResolveExecutor<void> = new MockResolveExecutor();
      const reject: IRejectExecutor<void> = new MockRejectExecutor();

      resolve.onResolve = spy1;
      reject.onReject = spy2;

      const executor: DoneExecutor<void, void> = DoneExecutor.of<void, void>(resolve, reject);

      await executor.onResolve();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });
  });

  describe('onReject', () => {
    it('normal case', async () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const resolve: IResolveExecutor<void> = new MockResolveExecutor();
      const reject: IRejectExecutor<void> = new MockRejectExecutor();

      resolve.onResolve = spy1;
      reject.onReject = spy2;

      const executor: DoneExecutor<void, void> = DoneExecutor.of<void, void>(resolve, reject);

      await executor.onReject();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
