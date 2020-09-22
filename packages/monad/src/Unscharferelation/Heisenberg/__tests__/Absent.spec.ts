import { MockRuntimeError } from '@jamashita/publikum-error';
import sinon, { SinonSpy } from 'sinon';
import { UnscharferelationError } from '../../Error/UnscharferelationError';
import { Absent } from '../Absent';
import { Heisenberg } from '../Heisenberg';
import { Lost } from '../Lost';
import { Present } from '../Present';
import { Uncertain } from '../Uncertain';

describe('Absent', () => {
  describe('get', () => {
    it('throws UnscharferelationError', () => {
      expect.assertions(2);

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
      expect.assertions(2);

      const absent1: Absent<void> = Absent.of<void>();
      const absent2: Absent<number> = Absent.of<number>();

      expect(absent1.isPresent()).toBe(false);
      expect(absent2.isPresent()).toBe(false);
    });
  });

  describe('isAbsent', () => {
    it('returns true', () => {
      expect.assertions(2);

      const absent1: Absent<void> = Absent.of<void>();
      const absent2: Absent<number> = Absent.of<number>();

      expect(absent1.isAbsent()).toBe(true);
      expect(absent2.isAbsent()).toBe(true);
    });
  });

  describe('isLost', () => {
    it('returns false', () => {
      expect.assertions(2);

      const absent1: Absent<void> = Absent.of<void>();
      const absent2: Absent<number> = Absent.of<number>();

      expect(absent1.isLost()).toBe(false);
      expect(absent2.isLost()).toBe(false);
    });
  });

  describe('ifPresent', () => {
    it('will not be invoked', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();

      const absent: Heisenberg<number> = Absent.of<number>();

      absent.ifPresent(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('ifAbsent', () => {
    it('will be invoked', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();

      const absent: Heisenberg<number> = Absent.of<number>();

      absent.ifAbsent(() => {
        spy();
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('ifLost', () => {
    it('will not be invoked', () => {
      expect.assertions(1);

      const spy: SinonSpy = sinon.spy();

      const absent: Heisenberg<number> = Absent.of<number>();

      absent.ifLost(() => {
        spy();
      });

      expect(spy.called).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true if the same instance given', () => {
      expect.assertions(1);

      const heisenberg: Heisenberg<number> = Absent.of<number>();

      expect(heisenberg.equals(heisenberg)).toBe(true);
    });

    it('returns true if Absent given', () => {
      expect.assertions(4);

      const present: Present<number> = Present.of<number>(2);
      const absent: Absent<number> = Absent.of<number>();
      const lost: Lost<number> = Lost.of<number>(new MockRuntimeError());
      const uncertain: Uncertain<number> = Uncertain.of<number>();

      const heisenberg: Heisenberg<number> = Absent.of<number>();

      expect(heisenberg.equals(present)).toBe(false);
      expect(heisenberg.equals(absent)).toBe(true);
      expect(heisenberg.equals(lost)).toBe(false);
      expect(heisenberg.equals(uncertain)).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns Absent', () => {
      expect.assertions(1);

      expect(Absent.of<number>().toString()).toBe('Absent');
    });
  });
});
