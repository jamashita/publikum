import sinon, { SinonSpy } from 'sinon';

import { Schrodinger } from '../../Superposition/Interface/Schrodinger';
import { UnscharferelationError } from '../Error/UnscharferelationError';
import { Absent } from '../Heisenberg/Absent';
import { Heisenberg } from '../Heisenberg/Heisenberg';
import { Present } from '../Heisenberg/Present';
import { Uncertain } from '../Heisenberg/Uncertain';
import { Unscharferelation } from '../Unscharferelation';

describe('Unscharferelation', () => {
  describe('all', () => {
    it('sync: no unschrferelation', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [];

      const heisenberg: Heisenberg<Array<number>> = await Unscharferelation.all<number>(unscharferelations).terminate();

      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get().length).toBe(unscharferelations.length);
    });

    it('sync: all are Present', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.ofHeisenberg<number>(Present.of<number>(0)),
        Unscharferelation.ofHeisenberg<number>(Present.of<number>(1)),
        Unscharferelation.ofHeisenberg<number>(Present.of<number>(2))
      ];

      const heisenberg: Heisenberg<Array<number>> = await Unscharferelation.all<number>(unscharferelations).terminate();

      expect(heisenberg.isPresent()).toBe(true);

      const array: Array<number> = heisenberg.get();

      expect(array.length).toBe(unscharferelations.length);
      for (let i: number = 0; i < array.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        const h: Heisenberg<number> = await unscharferelations[i].terminate();

        expect(array[i]).toBe(h.get());
      }
    });

    it('sync: contains Absent on first position', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.ofHeisenberg<number>(Absent.of<number>()),
        Unscharferelation.ofHeisenberg<number>(Present.of<number>(1)),
        Unscharferelation.ofHeisenberg<number>(Present.of<number>(2))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);

      await unscharferelation
        .map<null>(() => {
          spy1();

          return null;
        })
        .recover<null>(() => {
          spy2();

          return null;
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('sync: contains Absent on second position', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.ofHeisenberg<number>(Present.of<number>(0)),
        Unscharferelation.ofHeisenberg<number>(Absent.of<number>()),
        Unscharferelation.ofHeisenberg<number>(Present.of<number>(2))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);

      await unscharferelation
        .map<null>(() => {
          spy1();

          return null;
        })
        .recover<null>(() => {
          spy2();

          return null;
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('sync: contains Absent on last position', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.ofHeisenberg<number>(Present.of<number>(0)),
        Unscharferelation.ofHeisenberg<number>(Present.of<number>(1)),
        Unscharferelation.ofHeisenberg<number>(Absent.of<number>())
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);

      await unscharferelation
        .map<null>(() => {
          spy1();

          return null;
        })
        .recover<null>(() => {
          spy2();

          return null;
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('sync: contains more than 1 Absent, but the last one', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.ofHeisenberg<number>(Absent.of<number>()),
        Unscharferelation.ofHeisenberg<number>(Absent.of<number>()),
        Unscharferelation.ofHeisenberg<number>(Present.of<number>(2))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);

      await unscharferelation
        .map<null>(() => {
          spy1();

          return null;
        })
        .recover<null>(() => {
          spy2();

          return null;
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('sync: contains more than 1 Absent, but the second one', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.ofHeisenberg<number>(Absent.of<number>()),
        Unscharferelation.ofHeisenberg<number>(Present.of<number>(1)),
        Unscharferelation.ofHeisenberg<number>(Absent.of<number>())
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);

      await unscharferelation
        .map<null>(() => {
          spy1();

          return null;
        })
        .recover<null>(() => {
          spy2();

          return null;
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('sync: contains more than 1 Absent, but the first one', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.ofHeisenberg<number>(Present.of<number>(0)),
        Unscharferelation.ofHeisenberg<number>(Absent.of<number>()),
        Unscharferelation.ofHeisenberg<number>(Absent.of<number>())
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);

      await unscharferelation
        .map<null>(() => {
          spy1();

          return null;
        })
        .recover<null>(() => {
          spy2();

          return null;
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('sync: contains more than 1 Absent, all', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.ofHeisenberg<number>(Absent.of<number>()),
        Unscharferelation.ofHeisenberg<number>(Absent.of<number>()),
        Unscharferelation.ofHeisenberg<number>(Absent.of<number>())
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);

      await unscharferelation
        .map<null>(() => {
          spy1();

          return null;
        })
        .recover<null>(() => {
          spy2();

          return null;
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('async: all are Alive', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.ofHeisenberg<number>(Promise.resolve<Present<number>>(Present.of<number>(0))),
        Unscharferelation.ofHeisenberg<number>(Promise.resolve<Present<number>>(Present.of<number>(1))),
        Unscharferelation.ofHeisenberg<number>(Promise.resolve<Present<number>>(Present.of<number>(2)))
      ];

      const heisenberg: Heisenberg<Array<number>> = await Unscharferelation.all<number>(unscharferelations).terminate();

      expect(heisenberg.isPresent()).toBe(true);

      const array: Array<number> = heisenberg.get();

      expect(array.length).toBe(unscharferelations.length);
      for (let i: number = 0; i < array.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        const h: Heisenberg<number> = await unscharferelations[i].terminate();

        expect(array[i]).toBe(h.get());
      }
    });

    it('async: contains Absent on first position', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.ofHeisenberg<number>(Promise.resolve<Absent<number>>(Absent.of<number>())),
        Unscharferelation.ofHeisenberg<number>(Promise.resolve<Present<number>>(Present.of<number>(1))),
        Unscharferelation.ofHeisenberg<number>(Promise.resolve<Present<number>>(Present.of<number>(2)))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);

      await unscharferelation
        .map<null>(() => {
          spy1();

          return null;
        })
        .recover<null>(() => {
          spy2();

          return null;
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('async: contains Absent on second position', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.ofHeisenberg<number>(Promise.resolve<Present<number>>(Present.of<number>(0))),
        Unscharferelation.ofHeisenberg<number>(Promise.resolve<Absent<number>>(Absent.of<number>())),
        Unscharferelation.ofHeisenberg<number>(Promise.resolve<Present<number>>(Present.of<number>(2)))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);

      await unscharferelation
        .map<null>(() => {
          spy1();

          return null;
        })
        .recover<null>(() => {
          spy2();

          return null;
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('async: contains Absent on last position', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.ofHeisenberg<number>(Promise.resolve<Present<number>>(Present.of<number>(0))),
        Unscharferelation.ofHeisenberg<number>(Promise.resolve<Present<number>>(Present.of<number>(1))),
        Unscharferelation.ofHeisenberg<number>(Promise.resolve<Absent<number>>(Absent.of<number>()))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);

      await unscharferelation
        .map<null>(() => {
          spy1();

          return null;
        })
        .recover<null>(() => {
          spy2();

          return null;
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('async: contains more than 1 Absent, but the last one', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.ofHeisenberg<number>(Promise.resolve<Absent<number>>(Absent.of<number>())),
        Unscharferelation.ofHeisenberg<number>(Promise.resolve<Absent<number>>(Absent.of<number>())),
        Unscharferelation.ofHeisenberg<number>(Promise.resolve<Present<number>>(Present.of<number>(2)))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);

      await unscharferelation
        .map<null>(() => {
          spy1();

          return null;
        })
        .recover<null>(() => {
          spy2();

          return null;
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('async: contains more than 1 Absent, but the second one', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.ofHeisenberg<number>(Promise.resolve<Absent<number>>(Absent.of<number>())),
        Unscharferelation.ofHeisenberg<number>(Promise.resolve<Present<number>>(Present.of<number>(1))),
        Unscharferelation.ofHeisenberg<number>(Promise.resolve<Absent<number>>(Absent.of<number>()))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);

      await unscharferelation
        .map<null>(() => {
          spy1();

          return null;
        })
        .recover<null>(() => {
          spy2();

          return null;
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('async: contains more than 1 Absent, but the first one', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.ofHeisenberg<number>(Promise.resolve<Present<number>>(Present.of<number>(0))),
        Unscharferelation.ofHeisenberg<number>(Promise.resolve<Absent<number>>(Absent.of<number>())),
        Unscharferelation.ofHeisenberg<number>(Promise.resolve<Absent<number>>(Absent.of<number>()))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);

      await unscharferelation
        .map<null>(() => {
          spy1();

          return null;
        })
        .recover<null>(() => {
          spy2();

          return null;
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('async: contains more than 1 Absent, all', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.ofHeisenberg<number>(Promise.resolve<Absent<number>>(Absent.of<number>())),
        Unscharferelation.ofHeisenberg<number>(Promise.resolve<Absent<number>>(Absent.of<number>())),
        Unscharferelation.ofHeisenberg<number>(Promise.resolve<Absent<number>>(Absent.of<number>()))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);

      await unscharferelation
        .map<null>(() => {
          spy1();

          return null;
        })
        .recover<null>(() => {
          spy2();

          return null;
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('maybe', () => {
    it('sync present case', async () => {
      expect(await Unscharferelation.maybe(1).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(0).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe('a').terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe('').terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(true).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(false).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Symbol()).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(0n).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(1n).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(-1n).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe({}).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(new Error()).terminate()).toBeInstanceOf(Present);
    });

    it('sync absent case', async () => {
      expect(await Unscharferelation.maybe(null).terminate()).toBeInstanceOf(Absent);
      expect(await Unscharferelation.maybe(undefined).terminate()).toBeInstanceOf(Absent);
    });

    it('async present case', async () => {
      expect(await Unscharferelation.maybe(Promise.resolve(1)).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve(0)).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve('a')).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve('')).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve(true)).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve(false)).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve(Symbol())).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve(0n)).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve(1n)).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve(-1n)).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve({})).terminate()).toBeInstanceOf(Present);
      expect(await Unscharferelation.maybe(Promise.resolve(new Error())).terminate()).toBeInstanceOf(Present);
    });

    it('async absent case', async () => {
      expect(await Unscharferelation.maybe(Promise.resolve(null)).terminate()).toBeInstanceOf(Absent);
      expect(await Unscharferelation.maybe(Promise.resolve(undefined)).terminate()).toBeInstanceOf(Absent);
    });
  });

  describe('ofHeisenberg', () => {
    it('sync: present', async () => {
      const value: number = 3;
      const present: Present<number> = Present.of<number>(value);

      const unshcarferelation: Unscharferelation<number> = Unscharferelation.ofHeisenberg<number>(present);

      const heisenberg: Heisenberg<number> = await unshcarferelation.terminate();

      expect(heisenberg.get()).toBe(value);
    });

    it('sync: absent', async () => {
      const absent: Absent<number> = Absent.of<number>();

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofHeisenberg<number>(absent);

      const heisenberg: Heisenberg<number> = await unscharferelation.terminate();

      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('sync: uncertain', () => {
      const uncertain: Uncertain<number> = Uncertain.of<number>();

      expect(() => {
        Unscharferelation.ofHeisenberg<number>(uncertain);
      }).toThrow(UnscharferelationError);
    });

    it('async: alive', async () => {
      const value: number = 3;

      const present: Present<number> = Present.of<number>(value);

      const unshcarferelation: Unscharferelation<number> = Unscharferelation.ofHeisenberg<number>(
        Promise.resolve<Heisenberg<number>>(present)
      );

      const heisenberg: Heisenberg<number> = await unshcarferelation.terminate();

      expect(heisenberg.get()).toBe(value);
    });

    it('async: absent', async () => {
      const absent: Absent<number> = Absent.of<number>();

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofHeisenberg<number>(
        Promise.resolve<Heisenberg<number>>(absent)
      );

      const heisenberg: Heisenberg<number> = await unscharferelation.terminate();

      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });
  });

  describe('get', () => {
    it('returns inner value', async () => {
      const value: number = -201;

      const unscharferelation1: Unscharferelation<number> = Unscharferelation.ofHeisenberg(Present.of<number>(value));
      const unscharferelation2: Unscharferelation<number> = Unscharferelation.ofHeisenberg(Absent.of<number>());

      await expect(unscharferelation1.get()).resolves.toBe(value);
      await expect(unscharferelation2.get()).rejects.toThrow(UnscharferelationError);
    });
  });

  describe('terminate', () => {
    it('returns Heisenberg subclass instance', async () => {
      const value: number = -201;

      const present: Heisenberg<number> = await Unscharferelation.ofHeisenberg(Present.of<number>(value)).terminate();
      const absent: Heisenberg<number> = await Unscharferelation.ofHeisenberg(Absent.of<number>()).terminate();

      expect(present.isPresent()).toBe(true);
      expect(present.get()).toBe(value);
      expect(absent.isAbsent()).toBe(true);
      expect(() => {
        absent.get();
      }).toThrow(UnscharferelationError);
    });
  });

  describe('filter', () => {
    it('present: predicate returns true', async () => {
      const value: number = -201;

      const unscharferelation1: Unscharferelation<number> = Unscharferelation.ofHeisenberg(Present.of<number>(value));
      const unscharferelation2: Unscharferelation<number> = unscharferelation1.filter(() => {
        return true;
      });

      const heisenberg: Heisenberg<number> = await unscharferelation2.terminate();

      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('present: predicate returns false', async () => {
      const value: number = -201;

      const unscharferelation1: Unscharferelation<number> = Unscharferelation.ofHeisenberg(Present.of<number>(value));
      const unscharferelation2: Unscharferelation<number> = unscharferelation1.filter(() => {
        return false;
      });

      const heisenberg: Heisenberg<number> = await unscharferelation2.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('absent: returns itself inspite of the return value of filter', async () => {
      const unscharferelation1: Unscharferelation<number> = Unscharferelation.ofHeisenberg(Absent.of<number>());
      const unscharferelation2: Unscharferelation<number> = unscharferelation1.filter(() => {
        return true;
      });
      const unscharferelation3: Unscharferelation<number> = unscharferelation1.filter(() => {
        return false;
      });
      const heisenberg1: Heisenberg<number> = await unscharferelation2.terminate();
      const heisenberg2: Heisenberg<number> = await unscharferelation3.terminate();

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
  });

  describe('map', () => {
    it('sync case', async () => {
      const value: number = -201;
      const present: Unscharferelation<number> = Unscharferelation.ofHeisenberg(Present.of<number>(value));

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

          return v + 1;
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });

    it('async case', async () => {
      const value: number = -201;
      const present: Unscharferelation<number> = Unscharferelation.ofHeisenberg(Present.of<number>(value));

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

          return v + 1;
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });

    it('unscharferelation case', async () => {
      const value1: number = -201;
      const value2: number = -20100;
      const present1: Unscharferelation<number> = Unscharferelation.ofHeisenberg(Present.of<number>(value1));
      const present2: Unscharferelation<number> = Unscharferelation.ofHeisenberg(Present.of<number>(value2));

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

          return v + 1;
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });

    it('sync case: returns null', async () => {
      const value: number = -201;
      const present: Unscharferelation<number> = Unscharferelation.ofHeisenberg(Present.of<number>(value));

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

          return null;
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });

    it('async case: returns resolved null', async () => {
      const value: number = -201;
      const present: Unscharferelation<number> = Unscharferelation.ofHeisenberg(Present.of<number>(value));

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

          return null;
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });

    it('unscharferelation case: returns Absent Unscharferelation', async () => {
      const value: number = -201;
      const present: Unscharferelation<number> = Unscharferelation.ofHeisenberg(Present.of<number>(value));
      const absent: Unscharferelation<number> = Unscharferelation.ofHeisenberg(Absent.of<number>());

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

          return null;
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });

    it('already resolved unscharferelation case', async () => {
      const value: number = -201;
      const present: Unscharferelation<number> = Unscharferelation.ofHeisenberg(Present.of<number>(value));

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

          return v + 230;
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });
  });

  describe('recover', () => {
    it('sync case', async () => {
      const value: number = -201;
      const absent: Unscharferelation<number> = Unscharferelation.ofHeisenberg(Absent.of<number>());

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
        .map<number>((v: number) => {
          spy3();
          expect(v).toBe(value + 23);

          return v + 230;
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('async case', async () => {
      const value: number = -201;
      const absent: Unscharferelation<number> = Unscharferelation.ofHeisenberg(Absent.of<number>());

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

          return v + 340;
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('unscharferelation case', async () => {
      const value: number = -20100;
      const absent: Unscharferelation<number> = Unscharferelation.ofHeisenberg(Absent.of<number>());
      const present: Unscharferelation<number> = Unscharferelation.ofHeisenberg(Present.of<number>(value));

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

          return v + 2;
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('sync case: returns null', async () => {
      const value: number = -201;
      const present: Unscharferelation<number> = Unscharferelation.ofHeisenberg(Present.of<number>(value));

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

          return v + 230;
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy2.called).toBe(true);
    });

    it('async case: returns resolved null', async () => {
      const value: number = -201;
      const present: Unscharferelation<number> = Unscharferelation.ofHeisenberg(Present.of<number>(value));

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

          return v + 230;
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('unscharferelation case: returns Absent Unscharferelation', async () => {
      const value: number = -201;
      const present: Unscharferelation<number> = Unscharferelation.ofHeisenberg(Present.of<number>(value));
      const absent: Unscharferelation<number> = Unscharferelation.ofHeisenberg(Absent.of<number>());

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

          return value + 230;
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('already resolved unscharferelation case', async () => {
      const value: number = -201;
      const present: Unscharferelation<number> = Unscharferelation.ofHeisenberg(Present.of<number>(value));

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

          return v + 23;
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });
  });
  describe('toSuperposition', () => {
    it('present: will transform to alive', async () => {
      const value: number = -201;
      const present: Unscharferelation<number> = Unscharferelation.ofHeisenberg(Present.of<number>(value));

      const schrodinger: Schrodinger<number, UnscharferelationError> = await present.toSuperposition().terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(value);
    });

    it('absent: will transform to dead', async () => {
      const absent: Unscharferelation<number> = Unscharferelation.ofHeisenberg(Absent.of<number>());

      const schrodinger: Schrodinger<number, UnscharferelationError> = await absent.toSuperposition().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(UnscharferelationError);
    });
  });
});
