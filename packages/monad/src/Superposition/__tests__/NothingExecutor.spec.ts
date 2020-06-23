import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';

import { NothingExecutor } from '../NothingExecutor';

describe('NothingExecutor', () => {
  describe('onAlive', () => {
    it('only passees the value to next one', () => {
      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const executor: NothingExecutor<number, MockError> = NothingExecutor.of(
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
    it('only passees the value to next one', () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const executor: NothingExecutor<number, MockError> = NothingExecutor.of(
        () => {
          spy1();
        },
        (e: MockError) => {
          spy2();
          expect(e).toBe(error);
        }
      );

      executor.onDead(error);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
