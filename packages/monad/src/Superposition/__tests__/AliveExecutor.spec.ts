import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';

import { AliveExecutor } from '../AliveExecutor';

describe('AliveExecutor', () => {
  describe('onAlive', () => {
    it('is going to be executed', () => {
      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const executor: AliveExecutor<number, Error> = AliveExecutor.of(
        (n: number) => {
          spy1();
          expect(n).toBe(value);
        },
        () => {
          spy2();
        }
      );

      executor.onAlive(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });
  });

  describe('onDead', () => {
    it('is not going to be executed', () => {
      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const executor: AliveExecutor<number, Error> = AliveExecutor.of(
        (n: number) => {
          spy1();
          expect(n).toBe(value);
        },
        () => {
          spy2();
        }
      );

      executor.onDead(new MockError());

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
