import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';

import { DeadExecutor } from '../DeadExecutor';

describe('DeadExecutor', () => {
  describe('onAlive', () => {
    it('is not going to be executed', () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const executor: DeadExecutor<number, MockError> = DeadExecutor.of(
        (e: MockError) => {
          spy1();
          expect(e).toBe(error);
        },
        () => {
          spy2();
        }
      );

      executor.onAlive(1);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('onDead', () => {
    it('is going to be executed', () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const executor: DeadExecutor<number, MockError> = DeadExecutor.of(
        (e: MockError) => {
          spy1();
          expect(e).toBe(error);
        },
        () => {
          spy2();
        }
      );

      executor.onDead(error);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });
  });
});
