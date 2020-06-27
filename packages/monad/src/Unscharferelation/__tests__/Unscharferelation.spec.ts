import sinon, { SinonSpy } from 'sinon';

import { Resolve } from '@jamashita/publikum-type';

import { Schrodinger } from '../../Superposition/Interface/Schrodinger';
import { Absent } from '../Absent';
import { UnscharferelationError } from '../Error/UnscharferelationError';
import { Heisenberg } from '../Interface/Heisenberg';
import { Present } from '../Present';
import { Unscharferelation } from '../Unscharferelation';

describe('Unscharferelation', () => {
  describe('maybe', () => {
    it('sync present case', async () => {
      expect(await Unscharferelation.maybe(1)).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(0)).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe('a')).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe('')).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(true)).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(false)).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Symbol())).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(0n)).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(1n)).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(-1n)).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe({})).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(new Error())).toBeInstanceOf(Present);
    });

    it('sync absent case', async () => {
      expect(await Unscharferelation.maybe(null)).toBeInstanceOf(Absent);
      expect(await Unscharferelation.maybe(undefined)).toBeInstanceOf(Absent);
    });

    it('async present case', async () => {
      expect(await Unscharferelation.maybe(Promise.resolve(1))).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve(0))).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve('a'))).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve(''))).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve(true))).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve(false))).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve(Symbol()))).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve(0n))).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve(1n))).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve(-1n))).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve({}))).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve(new Error()))).toBeInstanceOf(Present);
    });

    it('async absent case', async () => {
      expect(await Unscharferelation.maybe(Promise.resolve(null))).toBeInstanceOf(Absent);
      expect(await Unscharferelation.maybe(Promise.resolve(undefined))).toBeInstanceOf(Absent);
    });
  });

  describe('present', () => {
    it('sync case', async () => {
      const value: number = 3;

      const heisenberg: Heisenberg<number> = await Unscharferelation.present<number>(value);

      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('async case', async () => {
      const value: number = 3;

      const heisenberg: Heisenberg<number> = await Unscharferelation.present<number>(Promise.resolve<number>(value));

      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('unscharferelation case: returns itself', () => {
      const present: Unscharferelation<number> = Unscharferelation.present(3);
      const absent: Unscharferelation<number> = Unscharferelation.absent();

      const unscharferelation1: Unscharferelation<number> = Unscharferelation.present<number>(present);
      const unscharferelation2: Unscharferelation<number> = Unscharferelation.present<number>(absent);

      expect(unscharferelation1).toBe(present);
      expect(unscharferelation2).toBe(absent);
    });
  });

  describe('absent', () => {
    it('sync case', async () => {
      const heisenberg1: Heisenberg<number> = await Unscharferelation.absent();
      const heisenberg2: Heisenberg<number> = await Unscharferelation.absent(undefined);
      const heisenberg3: Heisenberg<number> = await Unscharferelation.absent(null);

      expect(heisenberg1.isAbsent()).toBe(true);
      expect(heisenberg2.isAbsent()).toBe(true);
      expect(heisenberg3.isAbsent()).toBe(true);
      expect(() => {
        heisenberg1.get();
      }).toThrow(UnscharferelationError);
      expect(() => {
        heisenberg2.get();
      }).toThrow(UnscharferelationError);
      expect(() => {
        heisenberg3.get();
      }).toThrow(UnscharferelationError);
    });

    it('async case', async () => {
      const heisenberg1: Heisenberg<number> = await Unscharferelation.absent(Promise.resolve());
      const heisenberg2: Heisenberg<number> = await Unscharferelation.absent(Promise.resolve(undefined));
      const heisenberg3: Heisenberg<number> = await Unscharferelation.absent(Promise.resolve(null));

      expect(heisenberg1.isAbsent()).toBe(true);
      expect(heisenberg2.isAbsent()).toBe(true);
      expect(heisenberg3.isAbsent()).toBe(true);
      expect(() => {
        heisenberg1.get();
      }).toThrow(UnscharferelationError);
      expect(() => {
        heisenberg2.get();
      }).toThrow(UnscharferelationError);
      expect(() => {
        heisenberg3.get();
      }).toThrow(UnscharferelationError);
    });

    it('unscharferelation case: returns itself', () => {
      const present: Unscharferelation<number> = Unscharferelation.present(3);
      const absent: Unscharferelation<number> = Unscharferelation.absent();

      const unscharferelation1: Unscharferelation<number> = Unscharferelation.absent<number>(present);
      const unscharferelation2: Unscharferelation<number> = Unscharferelation.absent<number>(absent);

      expect(unscharferelation1).toBe(present);
      expect(unscharferelation2).toBe(absent);
    });
  });

  describe('get', () => {
    it('returns inner value', async () => {
      const value: number = -201;

      const unscharferelation1: Unscharferelation<number> = Unscharferelation.present(value);
      const unscharferelation2: Unscharferelation<number> = Unscharferelation.absent();

      await expect(unscharferelation1.get()).resolves.toBe(value);
      await expect(unscharferelation2.get()).rejects.toThrow(UnscharferelationError);
    });
  });

  describe('then', () => {
    it('returns Heisenberg subclass instance', async () => {
      const value: number = -201;

      const heisenberg1: Heisenberg<number> = await Unscharferelation.present(value);
      const heisenberg2: Heisenberg<number> = await Unscharferelation.absent();

      expect(heisenberg1.isPresent()).toBe(true);
      expect(heisenberg1.get()).toBe(value);
      expect(() => {
        heisenberg2.get();
      }).toThrow(UnscharferelationError);
    });
  });

  describe('filter', () => {
    it('present: predicate returns true', async () => {
      const value: number = -201;

      const unscharferelation1: Unscharferelation<number> = Unscharferelation.present(value);
      const unscharferelation2: Unscharferelation<number> = unscharferelation1.filter(() => {
        return true;
      });

      const heisenberg: Heisenberg<number> = await unscharferelation2;

      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('present: predicate returns false', async () => {
      const value: number = -201;

      const unscharferelation1: Unscharferelation<number> = Unscharferelation.present(value);
      const unscharferelation2: Unscharferelation<number> = unscharferelation1.filter(() => {
        return false;
      });

      const heisenberg: Heisenberg<number> = await unscharferelation2;

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('absent: returns itself inspite of the return value of filter', async () => {
      const unscharferelation1: Unscharferelation<number> = Unscharferelation.absent();
      const unscharferelation2: Unscharferelation<number> = unscharferelation1.filter(() => {
        return true;
      });
      const unscharferelation3: Unscharferelation<number> = unscharferelation1.filter(() => {
        return false;
      });
      const heisenberg1: Heisenberg<number> = await unscharferelation2;
      const heisenberg2: Heisenberg<number> = await unscharferelation3;

      expect(unscharferelation1).toBe(unscharferelation2);
      expect(heisenberg1.isAbsent()).toBe(true);
      expect(() => {
        heisenberg1.get();
      }).toThrow(UnscharferelationError);
      expect(unscharferelation1).toBe(unscharferelation3);
      expect(heisenberg2.isAbsent()).toBe(true);
      expect(() => {
        heisenberg2.get();
      }).toThrow(UnscharferelationError);
    });

    it('uncertain: predicate returns false', () => {
      const unscharferelation1: Unscharferelation<number> = Unscharferelation.present<number>(
        new Promise<number>((resolve: Resolve<number>) => {
          setTimeout(() => {
            resolve(1);
          }, 30000);
        })
      );
      const unscharferelation2: Unscharferelation<number> = unscharferelation1.filter(() => {
        return true;
      });
      const unscharferelation3: Unscharferelation<number> = unscharferelation1.filter(() => {
        return false;
      });

      expect(unscharferelation1).toBe(unscharferelation2);
      expect(unscharferelation1).toBe(unscharferelation3);
    });
  });

  describe('map', () => {
    it('sync case', async () => {
      const value: number = -201;
      const present: Unscharferelation<number> = Unscharferelation.present(value);

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
        });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });

    it('async case', async () => {
      const value: number = -201;
      const present: Unscharferelation<number> = Unscharferelation.present(value);

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
        });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });

    it('unscharferelation case', async () => {
      const value1: number = -201;
      const value2: number = -20100;
      const present1: Unscharferelation<number> = Unscharferelation.present(value1);
      const present2: Unscharferelation<number> = Unscharferelation.present(value2);

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
        });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });

    it('sync case: returns null', async () => {
      const value: number = -201;
      const present: Unscharferelation<number> = Unscharferelation.present(value);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      await present
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return null;
        })
        .map<number>(() => {
          spy2();
        });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });

    it('async case: returns resolved null', async () => {
      const value: number = -201;
      const present: Unscharferelation<number> = Unscharferelation.present(value);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      await present
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return Promise.resolve<null>(null);
        })
        .map<number>(() => {
          spy2();
        });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });

    it('unscharferelation case: returns Absent Unscharferelation', async () => {
      const value: number = -201;
      const present: Unscharferelation<number> = Unscharferelation.present(value);
      const absent: Unscharferelation<number> = Unscharferelation.absent();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      await present
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return absent;
        })
        .map<number>(() => {
          spy2();
        });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });

    it('already resolved unscharferelation case', async () => {
      const value: number = -201;
      const present: Unscharferelation<number> = Unscharferelation.present(value);

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

  describe('recover', () => {
    it('sync case', async () => {
      const value: number = -201;
      const absent: Unscharferelation<number> = Unscharferelation.absent();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await absent
        .map<number>((v: number) => {
          spy1();

          return v + 1;
        })
        .recover<number>(() => {
          spy2();

          return value + 23;
        })
        .map((v: number) => {
          spy3();
          expect(v).toBe(value + 23);
        });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('async case', async () => {
      const value: number = -201;
      const absent: Unscharferelation<number> = Unscharferelation.absent();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await absent
        .map<number>((v: number) => {
          spy1();

          return v + 1;
        })
        .recover<number>(() => {
          spy2();

          return Promise.resolve<number>(value + 23);
        })
        .map<number>((v: number) => {
          spy3();
          expect(v).toBe(value + 23);
        });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('unscharferelation case', async () => {
      const value: number = -20100;
      const absent: Unscharferelation<number> = Unscharferelation.absent();
      const present: Unscharferelation<number> = Unscharferelation.present(value);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await absent
        .map<number>(() => {
          spy1();

          return present;
        })
        .recover<number>(() => {
          spy2();

          return present;
        })
        .map<number>((v: number) => {
          spy3();
          expect(v).toBe(value);
        });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('sync case: returns null', async () => {
      const value: number = -201;
      const present: Unscharferelation<number> = Unscharferelation.present(value);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await present
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return null;
        })
        .recover<number>(() => {
          spy2();

          return value + 23;
        })
        .map<number>((v: number) => {
          spy3();
          expect(v).toBe(value + 23);
        });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy2.called).toBe(true);
    });

    it('async case: returns resolved null', async () => {
      const value: number = -201;
      const present: Unscharferelation<number> = Unscharferelation.present(value);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await present
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return Promise.resolve<null>(null);
        })
        .recover<number>(() => {
          spy2();

          return value + 23;
        })
        .map<number>((v: number) => {
          spy3();
          expect(v).toBe(value + 23);
        });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('unscharferelation case: returns Absent Unscharferelation', async () => {
      const value: number = -201;
      const present: Unscharferelation<number> = Unscharferelation.present(value);
      const absent: Unscharferelation<number> = Unscharferelation.absent();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await present
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return absent;
        })
        .recover<number>(() => {
          spy2();

          return value + 23;
        })
        .map<number>((v: number) => {
          spy3();
          expect(v).toBe(value + 23);
        });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('already resolved unscharferelation case', async () => {
      const value: number = -201;
      const present: Unscharferelation<number> = Unscharferelation.present(value);

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
        });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });
  });
  describe('toSuperposition', () => {
    it('present: will transform to alive', async () => {
      const value: number = -201;
      const present: Unscharferelation<number> = Unscharferelation.present(value);

      const schrodinger: Schrodinger<number, UnscharferelationError> = await present.toSuperposition();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(value);
    });

    it('absent: will transform to dead', async () => {
      const absent: Unscharferelation<number> = Unscharferelation.absent();

      const schrodinger: Schrodinger<number, UnscharferelationError> = await absent.toSuperposition();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(UnscharferelationError);
    });
  });
});
