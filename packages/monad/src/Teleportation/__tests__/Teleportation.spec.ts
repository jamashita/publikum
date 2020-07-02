import sinon, { SinonSpy, SinonStub } from 'sinon';

import { Cancelled } from '../Bennett/Cancelled';
import { MockTeleportation } from '../Mock/MockTeleportation';
import { Teleportation } from '../Teleportation';

describe('Teleportation', () => {
  // TODO STATIC METHODS
  describe('cancel', () => {
    it('delegate inner Teleportation', () => {
      const mock: MockTeleportation<number> = new MockTeleportation<number>();

      const spy: SinonSpy = sinon.spy();

      mock.cancel = spy;

      const teleportation: Teleportation<number> = Teleportation.ofTeleportatiion<number>(mock);

      teleportation.cancel();

      expect(spy.called).toBe(true);
    });
  });

  describe('get', () => {
    it('delegate inner Teleportation', async () => {
      const mock: MockTeleportation<number> = new MockTeleportation<number>();

      const spy: SinonSpy = sinon.spy();

      mock.get = spy;

      const teleportation: Teleportation<number> = Teleportation.ofTeleportatiion<number>(mock);

      await teleportation.get();

      expect(spy.called).toBe(true);
    });
  });

  describe('terminate', () => {
    it('delegate inner Teleportation', async () => {
      const mock: MockTeleportation<number> = new MockTeleportation<number>();

      const spy: SinonSpy = sinon.spy();

      mock.terminate = spy;

      const teleportation: Teleportation<number> = Teleportation.ofTeleportatiion<number>(mock);

      await teleportation.terminate();

      expect(spy.called).toBe(true);
    });
  });

  describe('then', () => {
    it('delegate inner Teleportation', async () => {
      const mock: MockTeleportation<number> = new MockTeleportation<number>();

      const spy: SinonSpy = sinon.spy();

      mock.then = spy;

      const teleportation: Teleportation<number> = Teleportation.ofTeleportatiion<number>(mock);

      await teleportation.then();

      expect(spy.called).toBe(true);
    });
  });

  describe('map', () => {
    it('delegate inner Teleportation', async () => {
      const mock1: MockTeleportation<number> = new MockTeleportation<number>();
      const mock2: MockTeleportation<number> = new MockTeleportation<number>();

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();

      mock1.map = stub1;
      stub1.returns(mock2);
      mock2.terminate = stub2;
      stub2.resolves(Cancelled.of<number>());

      const teleportation: Teleportation<number> = Teleportation.ofTeleportatiion<number>(mock1);

      await teleportation
        .map(() => {
          // NOOP
        })
        .terminate();

      expect(stub1.called).toBe(true);
    });
  });

  describe('recover', () => {
    it('delegate inner Teleportation', async () => {
      const mock1: MockTeleportation<number> = new MockTeleportation<number>();
      const mock2: MockTeleportation<number> = new MockTeleportation<number>();

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();

      mock1.recover = stub1;
      stub1.returns(mock2);
      mock2.terminate = stub2;
      stub2.resolves(Cancelled.of<number>());

      const teleportation: Teleportation<number> = Teleportation.ofTeleportatiion<number>(mock1);

      await teleportation
        .recover(() => {
          // NOOP
        })
        .terminate();

      expect(stub1.called).toBe(true);
    });
  });
});
