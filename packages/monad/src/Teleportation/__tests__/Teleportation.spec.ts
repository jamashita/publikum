import sinon, { SinonSpy, SinonStub } from 'sinon';

import { MockError } from '@jamashita/publikum-object';
import { Peek, Reject, Resolve } from '@jamashita/publikum-type';

import { Epoque } from '../../Epoque/Interface/Epoque';
import { Cancelled } from '../Bennett/Cancelled';
import { MockTeleportation } from '../Mock/MockTeleportation';
import { Teleportation } from '../Teleportation';

const wait = (millisec: number, str: string): Promise<string> => {
  return new Promise<string>((resolve: Resolve<string>) => {
    setTimeout(() => {
      resolve(str);
    }, millisec);
  });
};

const run = (millisec: number, bool: boolean, peek: Peek): Promise<void> => {
  const promise: Promise<void> = new Promise<void>((resolve: Resolve<void>, reject: Reject<MockError>) => {
    setTimeout(() => {
      if (bool) {
        resolve();

        return;
      }

      reject(new MockError());
    }, millisec);
  });

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  promise.then<void>(() => {
    peek();
  });

  return promise;
};

const runT = (millisec: number, bool: boolean, peek: Peek): PromiseLike<void> => {
  const teleportation: Teleportation<void> = Teleportation.of<void>((epoque: Epoque<void, MockError>) => {
    setTimeout(() => {
      if (bool) {
        epoque.resolve();

        return;
      }

      epoque.reject(new MockError());
    }, millisec);
  });

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  teleportation.then<void>(() => {
    peek();
  });

  return teleportation;
};

describe('Teleportation', () => {
  describe('all', () => {
    it('given array length is 0', async () => {
      const promises: Array<Promise<string>> = [];

      const array: Array<string> = await Teleportation.all<string>(promises);

      expect(array.length).toBe(0);
    });

    it('processes normally', async () => {
      const promises: Array<Promise<string>> = [wait(4, 'first'), wait(10, 'second')];

      const array: Array<string> = await Teleportation.all<string>(promises);

      expect(array.length).toBe(2);
      expect(array[0]).toBe('first');
      expect(array[1]).toBe('second');
    });

    it('maintains the original order even if last ones finishes first normally', async () => {
      const promises: Array<Promise<string>> = [wait(40, 'first'), wait(10, 'second'), wait(0, 'third')];

      const array: Array<string> = await Teleportation.all<string>(promises);

      expect(array.length).toBe(3);
      expect(array[0]).toBe('first');
      expect(array[1]).toBe('second');
      expect(array[2]).toBe('third');
    });

    it('if fails, other promises are going to be cancelled', async () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const promises: Array<Promise<void>> = [
        run(0, true, spy1),
        run(100, false, spy2),
        run(200, true, spy3),
        run(300, false, spy4)
      ];

      await expect(Teleportation.all<void>(promises)).rejects.toThrow(MockError);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('if fails, teleportations can cancel executing plans', async () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const promises: Array<PromiseLike<void>> = [
        runT(0, true, spy1),
        runT(300, false, spy2),
        runT(600, true, spy3),
        runT(900, false, spy4)
      ];

      await expect(Teleportation.all<void>(promises)).rejects.toThrow(MockError);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });
  });

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
