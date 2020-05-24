import sinon, { SinonSpy } from 'sinon';

import { Dead } from '../../Superposition/Dead';
import { Absent } from '../Absent';
import { QuantumError } from '../Error/QuantumError';
import { Quantum } from '../Quantum';

describe('Absent', () => {
  describe('get', () => {
    it('throws QuantumError', () => {
      const absent1: Absent<void> = Absent.of();
      const absent2: Absent<number> = Absent.of<number>();

      expect(() => {
        absent1.get();
      }).toThrow(QuantumError);
      expect(() => {
        absent2.get();
      }).toThrow(QuantumError);
    });
  });

  describe('isPresent', () => {
    it('returns false', () => {
      const absent1: Absent<void> = Absent.of();
      const absent2: Absent<number> = Absent.of<number>();

      expect(absent1.isPresent()).toBe(false);
      expect(absent2.isPresent()).toBe(false);
    });
  });

  describe('isAbsent', () => {
    it('returns true', () => {
      const absent1: Absent<void> = Absent.of();
      const absent2: Absent<number> = Absent.of<number>();

      expect(absent1.isAbsent()).toBe(true);
      expect(absent2.isAbsent()).toBe(true);
    });
  });

  describe('ifPresent', () => {
    it('consumer will not be invoked', () => {
      const absent: Absent<number> = Absent.of<number>();

      const spy1: SinonSpy = sinon.spy();

      absent.ifPresent(() => {
        spy1();
      });

      expect(spy1.called).toBe(false);
    });

    it('consumer is not invoked asynchronously ', async () => {
      const absent: Absent<number> = Absent.of<number>();

      const spy1: SinonSpy = sinon.spy();

      // eslint-disable-next-line @typescript-eslint/await-thenable
      await absent.ifPresent(() => {
        spy1();

        return Promise.resolve();
      });

      expect(spy1.called).toBe(false);
    });
  });

  describe('orElse', () => {
    it('get other value', () => {
      const value: number = 500;
      const absent: Absent<number> = Absent.of<number>();

      expect(absent.orElse(value)).toBe(value);
    });
  });

  describe('map', () => {
    it('following function will not be invoked', () => {
      const absent: Absent<number> = Absent.of<number>();

      const spy: SinonSpy = sinon.spy();

      const quantum: Quantum<number> = absent.map<number>((value: number) => {
        spy();

        return value;
      });

      expect(spy.called).toBe(false);
      expect(quantum).toBeInstanceOf(Absent);
    });
  });

  describe('toSuperposition', () => {
    it('returns Dead', () => {
      const absent: Absent<number> = Absent.of<number>();

      expect(absent.toSuperposition()).toBeInstanceOf(Dead);
    });
  });

  describe('filter', () => {
    it('following function will not be invoked', () => {
      const absent: Absent<number> = Absent.of<number>();

      const spy: SinonSpy = sinon.spy();

      const quantum: Quantum<number> = absent.filter(() => {
        spy();

        return true;
      });

      expect(spy.called).toBe(false);
      expect(absent).toBe(quantum);
    });
  });
});
