import { MockError } from '@jamashita/publikum-object';
import sinon, { SinonSpy } from 'sinon';

import { Lost } from '../Lost';

describe('Lost', () => {
  describe('get', () => {
    it('throws given error', () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const lost1: Lost<void> = Lost.of<void>(error1);
      const lost2: Lost<number> = Lost.of<number>(error2);

      expect(() => {
        lost1.get();
      }).toThrow(error1);
      expect(() => {
        lost2.get();
      }).toThrow(error2);
    });
  });

  describe('getCause', () => {
    it('returns given error', () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const lost1: Lost<void> = Lost.of<void>(error1);
      const lost2: Lost<number> = Lost.of<number>(error2);

      expect(lost1.getCause()).toBe(error1);
      expect(lost2.getCause()).toBe(error2);
    });
  });

  describe('isPresent', () => {
    it('returns false', () => {
      const error: MockError = new MockError();
      const lost: Lost<void> = Lost.of<void>(error);

      expect(lost.isPresent()).toBe(false);
    });
  });
  describe('isAbsent', () => {
    it('returns false', () => {
      const error: MockError = new MockError();
      const lost: Lost<void> = Lost.of<void>(error);

      expect(lost.isAbsent()).toBe(false);
    });
  });

  describe('isLost', () => {
    it('returns true', () => {
      const error: MockError = new MockError();
      const lost: Lost<void> = Lost.of<void>(error);

      expect(lost.isLost()).toBe(true);
    });
  });

  describe('ifPresent', () => {
    it('will not be invoked', () => {
      const error: MockError = new MockError();

      const spy: SinonSpy = sinon.spy();

      const lost: Lost<number> = Lost.of<number>(error);

      lost.ifPresent(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('ifAbsent', () => {
    it('will not be invoked', () => {
      const error: MockError = new MockError();

      const spy: SinonSpy = sinon.spy();

      const lost: Lost<number> = Lost.of<number>(error);

      lost.ifAbsent(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('ifLost', () => {
    it('will be invoked', () => {
      const error: MockError = new MockError();

      const spy: SinonSpy = sinon.spy();

      const lost: Lost<number> = Lost.of<number>(error);

      lost.ifLost(() => {
        spy();
      });

      expect(spy.called).toBe(true);
    });
  });
});
