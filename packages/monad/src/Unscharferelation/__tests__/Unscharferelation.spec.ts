import { MockError } from '@jamashita/publikum-object';
import sinon, { SinonSpy } from 'sinon';

import { Epoque } from '../../Epoque/Interface/Epoque';
import { Schrodinger } from '../../Superposition/Schrodinger/Schrodinger';
import { UnscharferelationError } from '../Error/UnscharferelationError';
import { Absent } from '../Heisenberg/Absent';
import { Heisenberg } from '../Heisenberg/Heisenberg';
import { Lost } from '../Heisenberg/Lost';
import { Present } from '../Heisenberg/Present';
import { Matter } from '../Interface/Matter';
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
        Unscharferelation.present<number>(0),
        Unscharferelation.present<number>(1),
        Unscharferelation.present<number>(2)
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
        Unscharferelation.absent<number>(),
        Unscharferelation.present<number>(1),
        Unscharferelation.present<number>(2)
      ];

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('sync: contains Absent on second position', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.present<number>(1),
        Unscharferelation.absent<number>(),
        Unscharferelation.present<number>(2)
      ];

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('sync: contains Absent on last position', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.present<number>(0),
        Unscharferelation.present<number>(1),
        Unscharferelation.absent<number>()
      ];

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('sync: contains more than 1 Absent, but the last one', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.absent<number>(),
        Unscharferelation.absent<number>(),
        Unscharferelation.present<number>(2)
      ];

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('sync: contains more than 1 Absent, but the second one', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.absent<number>(),
        Unscharferelation.present<number>(1),
        Unscharferelation.absent<number>()
      ];

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('sync: contains more than 1 Absent, but the first one', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.present<number>(0),
        Unscharferelation.absent<number>(),
        Unscharferelation.absent<number>()
      ];

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('sync: contains more than 1 Absent, all', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.absent<number>(),
        Unscharferelation.absent<number>(),
        Unscharferelation.absent<number>()
      ];

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('async: all are Alive', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.present<number>(Promise.resolve<number>(0)),
        Unscharferelation.present<number>(Promise.resolve<number>(1)),
        Unscharferelation.present<number>(Promise.resolve<number>(2))
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
        Unscharferelation.absent<number>(Promise.resolve<void>(undefined)),
        Unscharferelation.present<number>(Promise.resolve<number>(1)),
        Unscharferelation.present<number>(Promise.resolve<number>(2))
      ];

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('async: contains Absent on second position', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.present<number>(Promise.resolve<number>(0)),
        Unscharferelation.absent<number>(Promise.resolve<void>(undefined)),
        Unscharferelation.present<number>(Promise.resolve<number>(2))
      ];

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('async: contains Absent on last position', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.present<number>(Promise.resolve<number>(0)),
        Unscharferelation.present<number>(Promise.resolve<number>(1)),
        Unscharferelation.absent<number>(Promise.resolve<void>(undefined))
      ];

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('async: contains more than 1 Absent, but the last one', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.absent<number>(Promise.resolve<void>(undefined)),
        Unscharferelation.absent<number>(Promise.resolve<void>(undefined)),
        Unscharferelation.present<number>(Promise.resolve<number>(2))
      ];

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('async: contains more than 1 Absent, but the second one', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.absent<number>(Promise.resolve<void>(undefined)),
        Unscharferelation.present<number>(Promise.resolve<number>(1)),
        Unscharferelation.absent<number>(Promise.resolve<void>(undefined))
      ];

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('async: contains more than 1 Absent, but the first one', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.present<number>(Promise.resolve<number>(0)),
        Unscharferelation.absent<number>(Promise.resolve<void>(undefined)),
        Unscharferelation.absent<number>(Promise.resolve<void>(undefined))
      ];

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('async: contains more than 1 Absent, all', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.absent<number>(Promise.resolve<void>(undefined)),
        Unscharferelation.absent<number>(Promise.resolve<void>(undefined)),
        Unscharferelation.absent<number>(Promise.resolve<void>(undefined))
      ];

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('includes at least one Lost, will return Lost, Lost comes faster than Absent', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.of<number>((epoque: Epoque<Matter<number>, void>) => {
          epoque.throw(null);
        }),
        Unscharferelation.absent<number>(Promise.resolve<void>(undefined)),
        Unscharferelation.present<number>(Promise.resolve<number>(2))
      ];

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isLost()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('includes at least one Lost, will return Lost, Lost comes later than Absent', async () => {
      const unscharferelations: Array<Unscharferelation<number>> = [
        Unscharferelation.absent<number>(Promise.resolve<void>(undefined)),
        Unscharferelation.of<number>((epoque: Epoque<Matter<number>, void>) => {
          epoque.throw(null);
        }),
        Unscharferelation.present<number>(Promise.resolve<number>(2))
      ];

      const unscharferelation: Unscharferelation<Array<number>> = Unscharferelation.all<number>(unscharferelations);

      const heisenberg: Heisenberg<Array<number>> = await unscharferelation.terminate();

      expect(heisenberg.isLost()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
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

    it('async: Present case', async () => {
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

    it('async: Absent case', async () => {
      expect(await Unscharferelation.maybe(Promise.resolve(null)).terminate()).toBeInstanceOf(Absent);
      expect(await Unscharferelation.maybe(Promise.resolve(undefined)).terminate()).toBeInstanceOf(Absent);
    });

    it('async: Lost case', async () => {
      expect(await Unscharferelation.maybe(Promise.reject(new MockError())).terminate()).toBeInstanceOf(Lost);
    });
  });

  describe('present', () => {
    it('sync', async () => {
      const value: number = -8;

      const present: Unscharferelation<number> = Unscharferelation.present<number>(value);
      const heisenberg: Heisenberg<number> = await present.terminate();

      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('async', async () => {
      const value: number = -8;

      const present: Unscharferelation<number> = Unscharferelation.present<number>(Promise.resolve<number>(value));
      const heisenberg: Heisenberg<number> = await present.terminate();

      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('promise is rejected', async () => {
      const error: MockError = new MockError();

      const present: Unscharferelation<number> = Unscharferelation.present<number>(Promise.reject<number>(error));
      const heisenberg: Heisenberg<number> = await present.terminate();

      expect(heisenberg.isLost()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(error);
    });
  });

  describe('absent', () => {
    it('sync', async () => {
      const absent: Unscharferelation<number> = Unscharferelation.absent<number>();
      const heisenberg: Heisenberg<number> = await absent.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('async', async () => {
      const absent: Unscharferelation<number> = Unscharferelation.absent<number>(Promise.resolve<null>(null));
      const heisenberg: Heisenberg<number> = await absent.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('promise is rejected', async () => {
      const error: MockError = new MockError();

      const absent: Unscharferelation<number> = Unscharferelation.absent<number>(Promise.reject<null>(error));
      const heisenberg: Heisenberg<number> = await absent.terminate();

      expect(heisenberg.isLost()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(error);
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

  describe('ifPresent', () => {
    it('delegate inner Unscharferelation', () => {
      const mock: MockUnscharferelation<number> = new MockUnscharferelation<number>();

      const spy: SinonSpy = sinon.spy();

      mock.ifPresent = spy;

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofUnscharferelation<number>(mock);

      unscharferelation.ifPresent(() => {
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

  describe('peek', () => {
    it('delegate inner Unscharferelation', () => {
      const mock: MockUnscharferelation<number> = new MockUnscharferelation<number>();

      const spy: SinonSpy = sinon.spy();

      mock.peek = spy;

      const unscharferelation: Unscharferelation<number> = Unscharferelation.ofUnscharferelation<number>(mock);

      unscharferelation.peek(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('toSuperposition', () => {
    it('present: will transform to alive', async () => {
      const value: number = -201;

      const unscharferelation: Unscharferelation<number> = Unscharferelation.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.accept(value);
        }
      );

      const schrodinger: Schrodinger<
        number,
        UnscharferelationError
      > = await unscharferelation.toSuperposition().terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(value);
    });

    it('present: if the value is Error, will transform to dead', async () => {
      const value: MockError = new MockError();

      const unscharferelation: Unscharferelation<MockError> = Unscharferelation.of<MockError>(
        (epoque: Epoque<MockError, void>) => {
          epoque.accept(value);
        }
      );

      const schrodinger: Schrodinger<
        MockError,
        UnscharferelationError
      > = await unscharferelation.toSuperposition().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(UnscharferelationError);
    });

    it('absent: will transform to dead', async () => {
      const unscharferelation: Unscharferelation<number> = Unscharferelation.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.decline();
        }
      );

      const schrodinger: Schrodinger<
        number,
        UnscharferelationError
      > = await unscharferelation.toSuperposition().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(UnscharferelationError);
    });

    it('lost: will transform to contradiction', async () => {
      const error: MockError = new MockError();

      const unscharferelation: Unscharferelation<number> = Unscharferelation.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.throw(error);
        }
      );

      const schrodinger: Schrodinger<
        number,
        UnscharferelationError
      > = await unscharferelation.toSuperposition().terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });
  });
});
