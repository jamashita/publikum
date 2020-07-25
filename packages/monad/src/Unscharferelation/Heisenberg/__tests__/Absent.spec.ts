import { Heisenberg, Lost, Present } from '@jamashita/publikum-monad';
import { MockError } from '@jamashita/publikum-object';
import sinon, { SinonSpy } from 'sinon';
import { UnscharferelationError } from '../../Error/UnscharferelationError';
import { Absent } from '../Absent';
import { Uncertain } from '../Uncertain';

describe('Absent', () => {
  describe('get', () => {
    it('throws UnscharferelationError', () => {
      const absent1: Absent<void> = Absent.of<void>();
      const absent2: Absent<number> = Absent.of<number>();

      expect(() => {
        absent1.get();
      }).toThrow(UnscharferelationError);
      expect(() => {
        absent2.get();
      }).toThrow(UnscharferelationError);
    });
  });

  describe('isPresent', () => {
    it('returns false', () => {
      const absent1: Absent<void> = Absent.of<void>();
      const absent2: Absent<number> = Absent.of<number>();

      expect(absent1.isPresent()).toBe(false);
      expect(absent2.isPresent()).toBe(false);
    });
  });
  describe('isAbsent', () => {
    it('returns true', () => {
      const absent1: Absent<void> = Absent.of<void>();
      const absent2: Absent<number> = Absent.of<number>();

      expect(absent1.isAbsent()).toBe(true);
      expect(absent2.isAbsent()).toBe(true);
    });
  });

  describe('isLost', () => {
    it('returns false', () => {
      const absent1: Absent<void> = Absent.of<void>();
      const absent2: Absent<number> = Absent.of<number>();

      expect(absent1.isLost()).toBe(false);
      expect(absent2.isLost()).toBe(false);
    });
  });

  describe('ifPresent', () => {
    it('will not be invoked', () => {
      const spy: SinonSpy = sinon.spy();

      const absent: Absent<number> = Absent.of<number>();

      absent.ifPresent(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('ifAbsent', () => {
    it('will be invoked', () => {
      const spy: SinonSpy = sinon.spy();

      const absent: Absent<number> = Absent.of<number>();

      absent.ifAbsent(() => {
        spy();
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('ifLost', () => {
    it('will not be invoked', () => {
      const spy: SinonSpy = sinon.spy();

      const absent: Absent<number> = Absent.of<number>();

      absent.ifLost(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true if Absent given', () => {
      const present: Present<number> = Present.of<number>(2);
      const absent: Absent<number> = Absent.of<number>();
      const lost: Lost<number> = Lost.of<number>(new MockError());
      const uncertain: Uncertain<number> = Uncertain.of<number>();

      const heisenberg: Heisenberg<number> = Absent.of<number>();

      expect(heisenberg.equals(heisenberg)).toBe(true);
      expect(heisenberg.equals(present)).toBe(false);
      expect(heisenberg.equals(absent)).toBe(true);
      expect(heisenberg.equals(lost)).toBe(false);
      expect(heisenberg.equals(uncertain)).toBe(false);
    });
  });
});
