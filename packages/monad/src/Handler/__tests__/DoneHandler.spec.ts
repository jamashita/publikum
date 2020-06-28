import sinon, { SinonSpy } from 'sinon';

import { DoneHandler } from '../DoneHandler';
import { IRejectHandler } from '../Interface/IRejectHandler';
import { IResolveHandler } from '../Interface/IResolveHandler';
import { MockRejectHandler } from '../Mock/MockRejecHandler';
import { MockResolveHandler } from '../Mock/MockResolveHandler';

describe('DoneHandler', () => {
  describe('onResolve', () => {
    it('normal case', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const resolve: IResolveHandler<void> = new MockResolveHandler();
      const reject: IRejectHandler<void> = new MockRejectHandler();

      resolve.onResolve = spy1;
      reject.onReject = spy2;

      const handler: DoneHandler<void, void> = DoneHandler.of<void, void>(resolve, reject);

      handler.onResolve();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });
  });

  describe('onReject', () => {
    it('normal case', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const resolve: IResolveHandler<void> = new MockResolveHandler();
      const reject: IRejectHandler<void> = new MockRejectHandler();

      resolve.onResolve = spy1;
      reject.onReject = spy2;

      const handler: DoneHandler<void, void> = DoneHandler.of<void, void>(resolve, reject);

      handler.onReject();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
