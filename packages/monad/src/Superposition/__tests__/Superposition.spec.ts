import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';

import { SuperpositionError } from '../Error/SuperpositionError';
import { MockSuperposition } from '../Mock/MockSuperposition';
import { Alive } from '../Schrodinger/Alive';
import { Dead } from '../Schrodinger/Dead';
import { Schrodinger } from '../Schrodinger/Schrodinger';
import { Still } from '../Schrodinger/Still';
import { Superposition } from '../Superposition';

describe('Superposition', () => {
  describe('all', () => {
    it('sync: no superpositions', async () => {
      const superpositions: Array<Superposition<number, MockError>> = [];

      const schrodinger: Schrodinger<Array<number>, MockError> = await Superposition.all<number, MockError>(
        superpositions
      ).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get().length).toBe(superpositions.length);
    });

    it('sync: all are Alive', async () => {
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.ofSchrodinger<number, MockError>(Alive.of<number, MockError>(0)),
        Superposition.ofSchrodinger<number, MockError>(Alive.of<number, MockError>(1)),
        Superposition.ofSchrodinger<number, MockError>(Alive.of<number, MockError>(2))
      ];

      const schrodinger: Schrodinger<Array<number>, MockError> = await Superposition.all<number, MockError>(
        superpositions
      ).terminate();

      expect(schrodinger.isAlive()).toBe(true);

      const array: Array<number> = schrodinger.get();

      expect(array.length).toBe(superpositions.length);
      for (let i: number = 0; i < array.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        const s: Schrodinger<number, MockError> = await superpositions[i].terminate();

        expect(array[i]).toBe(s.get());
      }
    });

    it('sync: contains Dead on first position', async () => {
      const error: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.ofSchrodinger<number, MockError>(Dead.of<number, MockError>(error)),
        Superposition.ofSchrodinger<number, MockError>(Alive.of<number, MockError>(1)),
        Superposition.ofSchrodinger<number, MockError>(Alive.of<number, MockError>(2))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);

      await superposition
        .map<void>(() => {
          spy1();
        })
        .recover<void>((err: MockError) => {
          spy2();
          expect(err).toBe(error);
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('sync: contains Dead on second position', async () => {
      const error: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.ofSchrodinger<number, MockError>(Alive.of<number, MockError>(0)),
        Superposition.ofSchrodinger<number, MockError>(Dead.of<number, MockError>(error)),
        Superposition.ofSchrodinger<number, MockError>(Alive.of<number, MockError>(2))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);

      await superposition
        .map<void>(() => {
          spy1();
        })
        .recover<void>((err: MockError) => {
          spy2();
          expect(err).toBe(error);
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('sync: contains Dead on last position', async () => {
      const error: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.ofSchrodinger<number, MockError>(Alive.of<number, MockError>(0)),
        Superposition.ofSchrodinger<number, MockError>(Alive.of<number, MockError>(1)),
        Superposition.ofSchrodinger<number, MockError>(Dead.of<number, MockError>(error))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);

      await superposition
        .map<void>(() => {
          spy1();
        })
        .recover<void>((err: MockError) => {
          spy2();
          expect(err).toBe(error);
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('sync: contains more than 1 Dead, but the last one', async () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.ofSchrodinger<number, MockError>(Dead.of<number, MockError>(error1)),
        Superposition.ofSchrodinger<number, MockError>(Dead.of<number, MockError>(error2)),
        Superposition.ofSchrodinger<number, MockError>(Alive.of<number, MockError>(2))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);

      await superposition
        .map<void>(() => {
          spy1();
        })
        .recover<void>((err: MockError) => {
          spy2();
          expect(err).toBe(error1);
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('sync: contains more than 1 Dead, but the second one', async () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.ofSchrodinger<number, MockError>(Dead.of<number, MockError>(error1)),
        Superposition.ofSchrodinger<number, MockError>(Alive.of<number, MockError>(1)),
        Superposition.ofSchrodinger<number, MockError>(Dead.of<number, MockError>(error2))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);

      await superposition
        .map<void>(() => {
          spy1();
        })
        .recover<void>((err: MockError) => {
          spy2();
          expect(err).toBe(error1);
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('sync: contains more than 1 Dead, but the first one', async () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.ofSchrodinger<number, MockError>(Alive.of<number, MockError>(0)),
        Superposition.ofSchrodinger<number, MockError>(Dead.of<number, MockError>(error1)),
        Superposition.ofSchrodinger<number, MockError>(Dead.of<number, MockError>(error2))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);

      await superposition
        .map<void>(() => {
          spy1();
        })
        .recover<void>((err: MockError) => {
          spy2();
          expect(err).toBe(error1);
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('sync: contains more than 1 Dead, all', async () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const error3: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.ofSchrodinger<number, MockError>(Dead.of<number, MockError>(error1)),
        Superposition.ofSchrodinger<number, MockError>(Dead.of<number, MockError>(error2)),
        Superposition.ofSchrodinger<number, MockError>(Dead.of<number, MockError>(error3))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);

      await superposition
        .map<void>(() => {
          spy1();
        })
        .recover((err: MockError) => {
          spy2();
          expect(err).toBe(error1);
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('async: all are Alive', async () => {
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.ofSchrodinger<number, MockError>(Alive.of<number, MockError>(0)),
        Superposition.ofSchrodinger<number, MockError>(Alive.of<number, MockError>(1)),
        Superposition.ofSchrodinger<number, MockError>(Alive.of<number, MockError>(2))
      ];

      const schrodinger: Schrodinger<Array<number>, MockError> = await Superposition.all<number, MockError>(
        superpositions
      ).terminate();

      expect(schrodinger.isAlive()).toBe(true);

      const array: Array<number> = schrodinger.get();

      expect(array.length).toBe(superpositions.length);
      for (let i: number = 0; i < array.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        const s: Schrodinger<number, MockError> = await superpositions[i].terminate();

        expect(array[i]).toBe(s.get());
      }
    });

    it('async: contains Dead on first position', async () => {
      const error: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.ofSchrodinger<number, MockError>(Dead.of<number, MockError>(error)),
        Superposition.ofSchrodinger<number, MockError>(Alive.of<number, MockError>(1)),
        Superposition.ofSchrodinger<number, MockError>(Alive.of<number, MockError>(2))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);

      await superposition
        .map<void>(() => {
          spy1();
        })
        .recover<void>((err: MockError) => {
          spy2();
          expect(err).toBe(error);
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('async: contains Dead on second position', async () => {
      const error: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.ofSchrodinger<number, MockError>(Alive.of<number, MockError>(0)),
        Superposition.ofSchrodinger<number, MockError>(Dead.of<number, MockError>(error)),
        Superposition.ofSchrodinger<number, MockError>(Alive.of<number, MockError>(2))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);

      await superposition
        .map<void>(() => {
          spy1();
        })
        .recover<void>((err: MockError) => {
          spy2();
          expect(err).toBe(error);
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('async: contains Dead on last position', async () => {
      const error: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.ofSchrodinger<number, MockError>(Alive.of<number, MockError>(0)),
        Superposition.ofSchrodinger<number, MockError>(Alive.of<number, MockError>(1)),
        Superposition.ofSchrodinger<number, MockError>(Dead.of<number, MockError>(error))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);

      await superposition
        .map<void>(() => {
          spy1();
        })
        .recover<void>((err: MockError) => {
          spy2();
          expect(err).toBe(error);
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('async: contains more than 1 Dead, returns the first one', async () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.ofSchrodinger<number, MockError>(Dead.of<number, MockError>(error1)),
        Superposition.ofSchrodinger<number, MockError>(Dead.of<number, MockError>(error2)),
        Superposition.ofSchrodinger<number, MockError>(Alive.of<number, MockError>(2))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);

      await superposition
        .map<void>(() => {
          spy1();
        })
        .recover<void>((err: MockError) => {
          spy2();
          expect(err).toBe(error1);
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('async: contains more than 1 Dead, returns the first one - 2', async () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.ofSchrodinger<number, MockError>(Dead.of<number, MockError>(error1)),
        Superposition.ofSchrodinger<number, MockError>(Alive.of<number, MockError>(0)),
        Superposition.ofSchrodinger<number, MockError>(Dead.of<number, MockError>(error2))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);

      await superposition
        .map<void>(() => {
          spy1();
        })
        .recover<void>((err: MockError) => {
          spy2();
          expect(err).toBe(error1);
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('async: contains more than 1 Dead, returns the first one - 4', async () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const error3: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.ofSchrodinger<number, MockError>(Dead.of<number, MockError>(error1)),
        Superposition.ofSchrodinger<number, MockError>(Dead.of<number, MockError>(error2)),
        Superposition.ofSchrodinger<number, MockError>(Dead.of<number, MockError>(error3))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);

      await superposition
        .map<void>(() => {
          spy1();
        })
        .recover((err: MockError) => {
          spy2();
          expect(err).toBe(error1);
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('playground', () => {
    it('sync alive case', async () => {
      const v: number = 2;
      const superposition: Superposition<number, MockError> = Superposition.playground<number, MockError>(() => {
        return v;
      });

      const schrodinger: Schrodinger<number, MockError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(v);
    });

    it('sync dead case', async () => {
      const e: MockError = new MockError();
      const superposition: Superposition<number, MockError> = Superposition.playground<number, MockError>(() => {
        throw e;
      });

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const schrodinger: Schrodinger<number, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);

      await superposition
        .map<void>(() => {
          spy1();
        })
        .recover<void>((err: MockError) => {
          spy2();
          expect(e).toBe(err);
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('async alive case', async () => {
      const v: number = 2;
      const superposition: Superposition<number, MockError> = Superposition.playground<number, MockError>(
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          return v;
        }
      );

      const schrodinger: Schrodinger<number, MockError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(v);
    });

    it('async dead case', async () => {
      const e: MockError = new MockError();
      const superposition: Superposition<number, MockError> = Superposition.playground<number, MockError>(
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          throw e;
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const schrodinger: Schrodinger<number, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);

      await superposition
        .map<void>(() => {
          spy1();
        })
        .recover<void>((err: MockError) => {
          spy2();
          expect(e).toBe(err);
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('superposition case', () => {
      const alive: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Alive.of<number, MockError>(2)
      );
      const dead: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Dead.of<number, MockError>(new MockError())
      );

      const superposition1: Superposition<number, MockError> = Superposition.playground<number, MockError>(() => {
        return alive;
      });
      const superposition2: Superposition<number, MockError> = Superposition.playground<number, MockError>(() => {
        return dead;
      });

      expect(superposition1).toBe(alive);
      expect(superposition2).toBe(dead);
    });
  });

  describe('ofSchrodinger', () => {
    it('sync: alive', async () => {
      const value: number = -149;
      const alive: Alive<number, MockError> = Alive.of<number, MockError>(value);

      const superposition: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(alive);

      const schrodinger: Schrodinger<number, MockError> = await superposition.terminate();

      expect(schrodinger.get()).toBe(value);
    });

    it('sync: dead', async () => {
      const error: MockError = new MockError();
      const dead: Dead<number, MockError> = Dead.of<number, MockError>(error);

      const superposition: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(dead);

      const schrodinger: Schrodinger<number, MockError> = await superposition.terminate();

      expect(() => {
        schrodinger.get();
      }).toThrow(MockError);
    });

    it('sync: still', () => {
      const still: Still<number, MockError> = Still.of<number, MockError>();

      expect(() => {
        Superposition.ofSchrodinger<number, MockError>(still);
      }).toThrow(SuperpositionError);
    });

    it('async: alive', async () => {
      const value: number = -149;
      const alive: Alive<number, MockError> = Alive.of<number, MockError>(value);

      const superposition: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Promise.resolve<Schrodinger<number, MockError>>(alive)
      );

      const schrodinger: Schrodinger<number, MockError> = await superposition.terminate();

      expect(schrodinger.get()).toBe(value);
    });

    it('async: dead', async () => {
      const error: MockError = new MockError();
      const dead: Dead<number, MockError> = Dead.of<number, MockError>(error);

      const superposition: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Promise.resolve<Schrodinger<number, MockError>>(dead)
      );

      const schrodinger: Schrodinger<number, MockError> = await superposition.terminate();

      expect(() => {
        schrodinger.get();
      }).toThrow(MockError);
    });
  });

  describe('get', () => {
    it('delegate inner Superposition', async () => {
      const mock: MockSuperposition<number, MockError> = new MockSuperposition<number, MockError>();

      const spy: SinonSpy = sinon.spy();

      mock.get = spy;

      const superposition: Superposition<number, MockError> = Superposition.ofSuperposition<number, MockError>(mock);

      await superposition.get();

      expect(spy.called).toBe(true);
    });
  });

  describe('terminate', () => {
    it('delegate inner Superposition', async () => {
      const mock: MockSuperposition<number, MockError> = new MockSuperposition<number, MockError>();

      const spy: SinonSpy = sinon.spy();

      mock.terminate = spy;

      const superposition: Superposition<number, MockError> = Superposition.ofSuperposition<number, MockError>(mock);

      await superposition.terminate();

      expect(spy.called).toBe(true);
    });
  });

  describe('filter', () => {
    it('delegate inner Superposition', () => {
      const mock: MockSuperposition<number, MockError> = new MockSuperposition<number, MockError>();

      const spy: SinonSpy = sinon.spy();

      mock.filter = spy;

      const superposition: Superposition<number, MockError> = Superposition.ofSuperposition<number, MockError>(mock);

      superposition.filter(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('map', () => {
    it('delegate inner Superposition', () => {
      const mock: MockSuperposition<number, MockError> = new MockSuperposition<number, MockError>();

      const spy: SinonSpy = sinon.spy();

      mock.map = spy;

      const superposition: Superposition<number, MockError> = Superposition.ofSuperposition<number, MockError>(mock);

      superposition.map<number, MockError>((v: number) => {
        return v + 2;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('recover', () => {
    it('delegate inner Superposition', () => {
      const mock: MockSuperposition<number, MockError> = new MockSuperposition<number, MockError>();

      const spy: SinonSpy = sinon.spy();

      mock.recover = spy;

      const superposition: Superposition<number, MockError> = Superposition.ofSuperposition<number, MockError>(mock);

      superposition.recover<number, MockError>(() => {
        return 2;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('transform', () => {
    it('delegate inner Superposition', () => {
      const mock: MockSuperposition<number, MockError> = new MockSuperposition<number, MockError>();

      const spy: SinonSpy = sinon.spy();

      mock.transform = spy;

      const superposition: Superposition<number, MockError> = Superposition.ofSuperposition<number, MockError>(mock);

      superposition.transform<number, MockError>(
        () => {
          return 2;
        },
        () => {
          return 2;
        }
      );

      expect(spy.called).toBe(true);
    });
  });

  describe('toUnscharferelation', () => {
    it('delegate inner Superposition', () => {
      const mock: MockSuperposition<number, MockError> = new MockSuperposition<number, MockError>();

      const spy: SinonSpy = sinon.spy();

      mock.toUnscharferelation = spy;

      const superposition: Superposition<number, MockError> = Superposition.ofSuperposition<number, MockError>(mock);

      superposition.toUnscharferelation();

      expect(spy.called).toBe(true);
    });
  });
});
