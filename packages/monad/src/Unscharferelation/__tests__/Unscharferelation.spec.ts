import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';

import { UnscharferelationError } from '../Error/UnscharferelationError';
import { Absent } from '../Heisenberg/Absent';
import { Heisenberg } from '../Heisenberg/Heisenberg';
import { Lost } from '../Heisenberg/Lost';
import { Present } from '../Heisenberg/Present';
import { Uncertain } from '../Heisenberg/Uncertain';
import { MockUnscharferelation } from '../Mock/MockUnscharferelation';
import { Unscharferelation } from '../Unscharferelation';

describe('Unscharferelation', () => {
  describe('all', () => {
    it('no unschrferelation', async () => {
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

    it('including at least one lost, returns lost, comes faster than Absent', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.ofHeisenberg<number>(Lost.of<number>(null)),
        Unscharferelation.ofHeisenberg<number>(Absent.of<number>()),
        Unscharferelation.ofHeisenberg<number>(Present.of<number>(2))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isLost()).toBe(true);

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
      expect(spy2.called).toBe(false);
    });

    it('including at least one lost, returns lost, comes later than Absent', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.ofHeisenberg<number>(Absent.of<number>()),
        Unscharferelation.ofHeisenberg<number>(Lost.of<number>(null)),
        Unscharferelation.ofHeisenberg<number>(Present.of<number>(2))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isLost()).toBe(true);

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
      expect(spy2.called).toBe(false);
    });
  });

  describe('maybe', () => {
    it('sync: Present case', async () => {
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

    it('sync: Absent case', async () => {
      expect(await Unscharferelation.maybe(null).terminate()).toBeInstanceOf(Absent);
      expect(await Unscharferelation.maybe(undefined).terminate()).toBeInstanceOf(Absent);
    });

    it('async Present case', async () => {
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

    it('async Absent case', async () => {
      expect(await Unscharferelation.maybe(Promise.resolve(null)).terminate()).toBeInstanceOf(Absent);
      expect(await Unscharferelation.maybe(Promise.resolve(undefined)).terminate()).toBeInstanceOf(Absent);
    });

    it('async: Lost case', async () => {
      expect(await Unscharferelation.maybe(Promise.reject(new MockError())).terminate()).toBeInstanceOf(Lost);
    });
  });

  describe('ofHeisenberg', () => {
    it('sync: Present', async () => {
      const value: number = 3;
      const present: Present<number> = Present.of<number>(value);

      const unshcarferelation: Unscharferelation<number> = Unscharferelation.ofHeisenberg<number>(present);

      const heisenberg: Heisenberg<number> = await unshcarferelation.terminate();

      expect(heisenberg.get()).toBe(value);
    });

    it('sync: Absent', async () => {
      const absent: Absent<number> = Absent.of<number>();

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofHeisenberg<number>(absent);

      const heisenberg: Heisenberg<number> = await unscharferelation.terminate();

      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('sync: Lost', async () => {
      const error: MockError = new MockError();
      const lost: Lost<number> = Lost.of<number>(error);

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofHeisenberg<number>(lost);

      const heisenberg: Heisenberg<number> = await unscharferelation.terminate();

      expect(() => {
        heisenberg.get();
      }).toThrow(error);
    });

    it('sync: Uncertain', async () => {
      const uncertain: Uncertain<number> = Uncertain.of<number>();

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofHeisenberg<number>(uncertain);

      const heisenberg: Heisenberg<number> = await unscharferelation.terminate();

      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('async: Present', async () => {
      const value: number = 3;

      const present: Present<number> = Present.of<number>(value);

      const unshcarferelation: Unscharferelation<number> = Unscharferelation.ofHeisenberg<number>(
        Promise.resolve<Heisenberg<number>>(present)
      );

      const heisenberg: Heisenberg<number> = await unshcarferelation.terminate();

      expect(heisenberg.get()).toBe(value);
    });

    it('async: Absent', async () => {
      const absent: Absent<number> = Absent.of<number>();

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofHeisenberg<number>(
        Promise.resolve<Heisenberg<number>>(absent)
      );

      const heisenberg: Heisenberg<number> = await unscharferelation.terminate();

      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('async: Lost', async () => {
      const error: MockError = new MockError();
      const lost: Lost<number> = Lost.of<number>(error);

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofHeisenberg<number>(
        Promise.resolve<Heisenberg<number>>(lost)
      );

      const heisenberg: Heisenberg<number> = await unscharferelation.terminate();

      expect(() => {
        heisenberg.get();
      }).toThrow(error);
    });

    it('async: Uncertain', async () => {
      const uncertain: Uncertain<number> = Uncertain.of<number>();

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofHeisenberg<number>(
        Promise.resolve<Heisenberg<number>>(uncertain)
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

  describe('pass', () => {
    it('delegate inner Unscharferelation', () => {
      const mock: MockUnscharferelation<number> = new MockUnscharferelation<number>();

      const spy: SinonSpy = sinon.spy();

      mock.pass = spy;

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofUnscharferelation<number>(mock);

      unscharferelation.pass(
        () => {
          return 1;
        },
        () => {
          return 2;
        },
        () => {
          return 3;
        }
      );

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
