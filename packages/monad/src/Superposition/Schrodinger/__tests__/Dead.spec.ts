import { MockError } from '@jamashita/publikum-object';
import sinon, { SinonSpy } from 'sinon';

import { Dead } from '../Dead';

describe('Dead', () => {
  describe('get', () => {
    it('throws the inside error', () => {
      const dead: Dead<number, MockError> = Dead.of<number, MockError>(new MockError());

      expect(() => {
        dead.get();
      }).toThrow(MockError);
    });
  });

  describe('getError', () => {
    it('normal case', () => {
      const error: MockError = new MockError();
      const dead: Dead<number, MockError> = Dead.of<number, MockError>(error);

      expect(dead.getError()).toBe(error);
    });
  });

  describe('isAlive', () => {
    it('always returns false', () => {
      const dead1: Dead<number, MockError> = Dead.of<number, MockError>(new MockError());
      const dead2: Dead<number, MockError> = Dead.of<number, MockError>(new MockError());

      expect(dead1.isAlive()).toBe(false);
      expect(dead2.isAlive()).toBe(false);
    });
  });

  describe('isDead', () => {
    it('always returns true', () => {
      const dead1: Dead<number, MockError> = Dead.of<number, MockError>(new MockError());
      const dead2: Dead<number, MockError> = Dead.of<number, MockError>(new MockError());

      expect(dead1.isDead()).toBe(true);
      expect(dead2.isDead()).toBe(true);
    });
  });

  describe('isContradiction', () => {
    it('always returns false', () => {
      const dead1: Dead<number, MockError> = Dead.of<number, MockError>(new MockError());
      const dead2: Dead<number, MockError> = Dead.of<number, MockError>(new MockError());

      expect(dead1.isContradiction()).toBe(false);
      expect(dead2.isContradiction()).toBe(false);
    });
  });

  describe('ifAlive', () => {
    it('will not be invoked', () => {
      const error: MockError = new MockError();

      const spy: SinonSpy = sinon.spy();

      const dead: Dead<number, MockError> = Dead.of<number, MockError>(error);

      dead.ifAlive(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('ifDead', () => {
    it('will be invoked', () => {
      const error: MockError = new MockError();

      const spy: SinonSpy = sinon.spy();

      const dead: Dead<number, MockError> = Dead.of<number, MockError>(error);

      dead.ifDead((e: MockError) => {
        spy();
        expect(e).toBe(error);
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('ifContradiction', () => {
    it('will not be invoked', () => {
      const error: MockError = new MockError();

      const spy: SinonSpy = sinon.spy();

      const dead: Dead<number, MockError> = Dead.of<number, MockError>(error);

      dead.ifContradiction(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });
});
