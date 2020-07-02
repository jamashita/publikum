import sinon, { SinonSpy } from 'sinon';

import { UnscharferelationError } from '../Error/UnscharferelationError';
import { Absent } from '../Heisenberg/Absent';
import { Heisenberg } from '../Heisenberg/Heisenberg';
import { Present } from '../Heisenberg/Present';
import { Uncertain } from '../Heisenberg/Uncertain';
import { MockUnscharferelation } from '../Mock/MockUnscharferelation';
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
    it('delegate inner Unscharferelation', async () => {
      const mock: MockUnscharferelation<number> = new MockUnscharferelation<number>();

      const spy: SinonSpy = sinon.spy();

      mock.get = spy;

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofUnscharferelation<number>(mock);

      await unscharferelation.get();

      expect(spy.called).toBe(true);
    });
  });

  describe('terminate', () => {
    it('delegate inner Unscharferelation', async () => {
      const mock: MockUnscharferelation<number> = new MockUnscharferelation<number>();

      const spy: SinonSpy = sinon.spy();

      mock.terminate = spy;

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofUnscharferelation<number>(mock);

      await unscharferelation.terminate();

      expect(spy.called).toBe(true);
    });
  });

  describe('filter', () => {
    it('delegate inner Unscharferelation', () => {
      const mock: MockUnscharferelation<number> = new MockUnscharferelation<number>();

      const spy: SinonSpy = sinon.spy();

      mock.filter = spy;

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofUnscharferelation<number>(mock);

      unscharferelation.filter(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('map', () => {
    it('delegate inner Unscharferelation', () => {
      const mock: MockUnscharferelation<number> = new MockUnscharferelation<number>();

      const spy: SinonSpy = sinon.spy();

      mock.map = spy;

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofUnscharferelation<number>(mock);

      unscharferelation.map<number>((v: number) => {
        return v + 2;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('recover', () => {
    it('delegate inner Unscharferelation', () => {
      const mock: MockUnscharferelation<number> = new MockUnscharferelation<number>();

      const spy: SinonSpy = sinon.spy();

      mock.recover = spy;

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofUnscharferelation<number>(mock);

      unscharferelation.recover(() => {
        return 2;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('toSuperposition', () => {
    it('delegate inner Unscharferelation', () => {
      const mock: MockUnscharferelation<number> = new MockUnscharferelation<number>();

      const spy: SinonSpy = sinon.spy();

      mock.toSuperposition = spy;

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofUnscharferelation<number>(mock);

      unscharferelation.toSuperposition();

      expect(spy.called).toBe(true);
    });
  });
});
