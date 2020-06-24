import sinon, { SinonSpy } from 'sinon';

import { Resolve } from '@jamashita/publikum-type';

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

  describe('get', () => {
    it('returns Heisenberg subclass instance', async () => {
      const value: number = -201;

      const quantization1: Quantization<number> = Quantization.present(value);
      const quantization2: Quantization<number> = Quantization.absent();

      const heisenberg1: Heisenberg<number> = await quantization1.get();
      const heisenberg2: Heisenberg<number> = await quantization2.get();

      expect(heisenberg1.isPresent()).toBe(true);
      expect(heisenberg1.get()).toBe(value);
      expect(() => {
        heisenberg2.get();
      }).toThrow(QuantizationError);
    });
  });

  describe('then', () => {
    it('returns inner value', async () => {
      const value: number = -201;

      const quantization1: Quantization<number> = Quantization.present(value);
      const quantization2: Quantization<number> = Quantization.absent();

      await expect(quantization1).resolves.toBe(value);
      await expect(quantization2).rejects.toThrow(QuantizationError);
    });
  });

  describe('filter', () => {
    it('present: predicate returns true', async () => {
      const value: number = -201;

      const quantization1: Quantization<number> = Quantization.present(value);
      const quantization2: Quantization<number> = quantization1.filter(() => {
        return true;
      });

      const heisenberg: Heisenberg<number> = await quantization2.get();

      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('present: predicate returns false', async () => {
      const value: number = -201;

      const quantization1: Quantization<number> = Quantization.present(value);
      const quantization2: Quantization<number> = quantization1.filter(() => {
        return false;
      });

      const heisenberg: Heisenberg<number> = await quantization2.get();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(QuantizationError);
    });

    it('absent: returns itself inspite of the return value of filter', async () => {
      const quantization1: Quantization<number> = Quantization.absent();
      const quantization2: Quantization<number> = quantization1.filter(() => {
        return true;
      });
      const quantization3: Quantization<number> = quantization1.filter(() => {
        return false;
      });
      const heisenberg1: Heisenberg<number> = await quantization2.get();
      const heisenberg2: Heisenberg<number> = await quantization3.get();

      expect(quantization1).toBe(quantization2);
      expect(heisenberg1.isAbsent()).toBe(true);
      expect(() => {
        heisenberg1.get();
      }).toThrow(QuantizationError);
      expect(quantization1).toBe(quantization3);
      expect(heisenberg2.isAbsent()).toBe(true);
      expect(() => {
        heisenberg2.get();
      }).toThrow(QuantizationError);
    });

    it('uncertain: predicate returns false', () => {
      const quantization1: Quantization<void> = Quantization.present(
        new Promise((resolve: Resolve<void>) => {
          setTimeout(() => {
            resolve();
          }, 30000);
        })
      );
      const quantization2: Quantization<void> = quantization1.filter(() => {
        return true;
      });
      const quantization3: Quantization<void> = quantization1.filter(() => {
        return false;
      });

      expect(quantization1).toBe(quantization2);
      expect(quantization1).toBe(quantization3);
    });
  });

  describe('map', () => {
    it('sync case', async () => {
      const value: number = -201;
      const present: Quantization<number> = Quantization.present(value);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      await present
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return v + 1;
        })
        .map<number>((v: number) => {
          spy2();
          expect(v).toBe(value + 1);

          return v;
        });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });

    it('async case', async () => {
      const value: number = -201;
      const present: Quantization<number> = Quantization.present(value);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      await present
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return Promise.resolve<number>(v + 1);
        })
        .map<number>((v: number) => {
          spy2();
          expect(v).toBe(value + 1);

          return v;
        });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });

    it('quantization case', async () => {
      const value1: number = -201;
      const value2: number = -20100;
      const present1: Quantization<number> = Quantization.present(value1);
      const present2: Quantization<number> = Quantization.present(value2);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      await present1
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value1);

          return present2;
        })
        .map<number>((v: number) => {
          spy2();
          expect(v).toBe(value2);

          return v;
        });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });

    it('sync case: returns null', async () => {
      const value: number = -201;
      const present: Quantization<number> = Quantization.present(value);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const quantization: Quantization<number> = present
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return null;
        })
        .map<number>((v: number) => {
          spy2();

          return v;
        });

      await expect(quantization).rejects.toThrow(QuantizationError);
      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });

    it('async case: returns resolved null', async () => {
      const value: number = -201;
      const present: Quantization<number> = Quantization.present(value);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const quantization: Quantization<number> = present
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return Promise.resolve<null>(null);
        })
        .map<number>((v: number) => {
          spy2();

          return v;
        });

      await expect(quantization).rejects.toThrow(QuantizationError);
      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });

    it('quantization case: returns Absent Quantization', async () => {
      const value: number = -201;
      const present: Quantization<number> = Quantization.present(value);
      const absent: Quantization<number> = Quantization.absent();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const quantization: Quantization<number> = present
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return absent;
        })
        .map<number>((v: number) => {
          spy2();

          return v;
        });

      await expect(quantization).rejects.toThrow(QuantizationError);
      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });

    it('already resolved quantization case', async () => {
      const value: number = -201;
      const present: Quantization<number> = Quantization.present(value);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      await present
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return present;
        })
        .map<number>((v: number) => {
          spy2();
          expect(v).toBe(value);

          return v;
        });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });
  });
});