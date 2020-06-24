import sinon, { SinonSpy } from 'sinon';

import { Absent } from '../Absent';
import { QuantizationError } from '../Error/QuantizationError';
import { Heisenberg } from '../Interface/Heisenberg';
import { Present } from '../Present';
import { Quantization } from '../Quantization';

describe('Quantization', () => {
  describe('maybe', () => {
    it('sync present case', async () => {
      expect(await Quantization.maybe(1).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(0).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe('a').get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe('').get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(true).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(false).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(Symbol()).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(0n).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(1n).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(-1n).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe({}).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(new Error()).get()).toBeInstanceOf(Present);
    });

    it('sync absent case', async () => {
      expect(await Quantization.maybe(null).get()).toBeInstanceOf(Absent);
      expect(await Quantization.maybe(undefined).get()).toBeInstanceOf(Absent);
    });

    it('async present case', async () => {
      expect(await Quantization.maybe(Promise.resolve(1)).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(Promise.resolve(0)).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(Promise.resolve('a')).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(Promise.resolve('')).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(Promise.resolve(true)).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(Promise.resolve(false)).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(Promise.resolve(Symbol())).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(Promise.resolve(0n)).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(Promise.resolve(1n)).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(Promise.resolve(-1n)).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(Promise.resolve({})).get()).toBeInstanceOf(Present);
      expect(await Quantization.maybe(Promise.resolve(new Error())).get()).toBeInstanceOf(Present);
    });

    it('async absent case', async () => {
      expect(await Quantization.maybe(Promise.resolve(null)).get()).toBeInstanceOf(Absent);
      expect(await Quantization.maybe(Promise.resolve(undefined)).get()).toBeInstanceOf(Absent);
    });
  });

  describe('present', () => {
    it('sync case', async () => {
      const value: number = 3;
      const quantization: Quantization<number> = Quantization.present<number>(value);

      const heisenberg: Heisenberg<number> = await quantization.get();

      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('async case', async () => {
      const value: number = 3;
      const quantization: Quantization<number> = Quantization.present<number>(Promise.resolve<number>(value));

      const heisenberg: Heisenberg<number> = await quantization.get();

      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('quantization case: returns itself', () => {
      const present: Quantization<number> = Quantization.present(3);
      const absent: Quantization<number> = Quantization.absent();

      const quantization1: Quantization<number> = Quantization.present<number>(present);
      const quantization2: Quantization<number> = Quantization.present<number>(absent);

      expect(quantization1).toBe(present);
      expect(quantization2).toBe(absent);
    });
  });

  describe('absent', () => {
    it('sync case', async () => {
      const quantization1: Quantization<number> = Quantization.absent();
      const quantization2: Quantization<number> = Quantization.absent(undefined);
      const quantization3: Quantization<number> = Quantization.absent(null);

      const heisenberg1: Heisenberg<number> = await quantization1.get();
      const heisenberg2: Heisenberg<number> = await quantization2.get();
      const heisenberg3: Heisenberg<number> = await quantization3.get();

      expect(heisenberg1.isAbsent()).toBe(true);
      expect(heisenberg2.isAbsent()).toBe(true);
      expect(heisenberg3.isAbsent()).toBe(true);
      expect(() => {
        heisenberg1.get();
      }).toThrow(QuantizationError);
      expect(() => {
        heisenberg2.get();
      }).toThrow(QuantizationError);
      expect(() => {
        heisenberg3.get();
      }).toThrow(QuantizationError);
    });

    it('async case', async () => {
      const quantization1: Quantization<number> = Quantization.absent(Promise.resolve());
      const quantization2: Quantization<number> = Quantization.absent(Promise.resolve(undefined));
      const quantization3: Quantization<number> = Quantization.absent(Promise.resolve(null));

      const heisenberg1: Heisenberg<number> = await quantization1.get();
      const heisenberg2: Heisenberg<number> = await quantization2.get();
      const heisenberg3: Heisenberg<number> = await quantization3.get();

      expect(heisenberg1.isAbsent()).toBe(true);
      expect(heisenberg2.isAbsent()).toBe(true);
      expect(heisenberg3.isAbsent()).toBe(true);
      expect(() => {
        heisenberg1.get();
      }).toThrow(QuantizationError);
      expect(() => {
        heisenberg2.get();
      }).toThrow(QuantizationError);
      expect(() => {
        heisenberg3.get();
      }).toThrow(QuantizationError);
    });

    it('quantization case: returns itself', () => {
      const present: Quantization<number> = Quantization.present(3);
      const absent: Quantization<number> = Quantization.absent();

      const quantization1: Quantization<number> = Quantization.absent<number>(present);
      const quantization2: Quantization<number> = Quantization.absent<number>(absent);

      expect(quantization1).toBe(present);
      expect(quantization2).toBe(absent);
    });
  });

  describe('ofPromise', () => {
    it('quantization case: returns itself', () => {
      const present: Quantization<number> = Quantization.present(3);
      const absent: Quantization<number> = Quantization.absent();

      const quantization1: Quantization<number> = Quantization.ofPromise<number>(present);
      const quantization2: Quantization<number> = Quantization.ofPromise<number>(absent);

      expect(quantization1).toBe(present);
      expect(quantization2).toBe(absent);
    });

    it('resolved case', async () => {
      const value: number = 3;
      const promise: Promise<number> = Promise.resolve<number>(value);
      const quantization: Quantization<number> = Quantization.ofPromise(promise);

      const spy1: SinonSpy = sinon.spy();

      await quantization.map((v: number) => {
        spy1();
        expect(v).toBe(value);

        return v + 1;
      });

      expect(spy1.called).toBe(true);
    });

    it('rejected case', async () => {
      const promise1: Promise<void> = Promise.resolve();
      const promise2: Promise<undefined> = Promise.resolve(undefined);
      const promise3: Promise<null> = Promise.resolve(null);
      const quantization1: Quantization<void> = Quantization.ofPromise(promise1);
      const quantization2: Quantization<undefined> = Quantization.ofPromise(promise2);
      const quantization3: Quantization<null> = Quantization.ofPromise(promise3);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await expect(
        quantization1.map(() => {
          spy1();
        })
      ).rejects.toThrow(QuantizationError);
      await expect(
        quantization2.map(() => {
          spy2();
        })
      ).rejects.toThrow(QuantizationError);
      await expect(
        quantization3.map(() => {
          spy3();
        })
      ).rejects.toThrow(QuantizationError);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });
  });
});
