import sinon, { SinonSpy } from 'sinon';
import { UnscharferelationError } from '../../Error/UnscharferelationError';
import { Uncertain } from '../Uncertain';

describe('Uncertain', () => {
  describe('get', () => {
    it('throws UnscharferelationError', () => {
      const uncertain1: Uncertain<void> = Uncertain.of<void>();
      const uncertain2: Uncertain<number> = Uncertain.of<number>();

      expect(() => {
        uncertain1.get();
      }).toThrow(UnscharferelationError);
      expect(() => {
        uncertain2.get();
      }).toThrow(UnscharferelationError);
    });
  });

  describe('isPresent', () => {
    it('returns false', () => {
      const uncertain1: Uncertain<void> = Uncertain.of<void>();
      const uncertain2: Uncertain<number> = Uncertain.of<number>();

      expect(uncertain1.isPresent()).toBe(false);
      expect(uncertain2.isPresent()).toBe(false);
    });
  });

  describe('isAbsent', () => {
    it('returns false', () => {
      const uncertain1: Uncertain<void> = Uncertain.of<void>();
      const uncertain2: Uncertain<number> = Uncertain.of<number>();

      expect(uncertain1.isAbsent()).toBe(false);
      expect(uncertain2.isAbsent()).toBe(false);
    });
  });

  describe('isLost', () => {
    it('returns false', () => {
      const uncertain1: Uncertain<void> = Uncertain.of<void>();
      const uncertain2: Uncertain<number> = Uncertain.of<number>();

      expect(uncertain1.isLost()).toBe(false);
      expect(uncertain2.isLost()).toBe(false);
    });
  });

  describe('ifPresent', () => {
    it('will not be invoked', () => {
      const spy: SinonSpy = sinon.spy();

      const uncertain: Uncertain<number> = Uncertain.of<number>();

      uncertain.ifPresent(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('ifAbsent', () => {
    it('will not be invoked', () => {
      const spy: SinonSpy = sinon.spy();

      const uncertain: Uncertain<number> = Uncertain.of<number>();

      uncertain.ifAbsent(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('ifLost', () => {
    it('will not be invoked', () => {
      const spy: SinonSpy = sinon.spy();

      const uncertain: Uncertain<number> = Uncertain.of<number>();

      uncertain.ifLost(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });
});
