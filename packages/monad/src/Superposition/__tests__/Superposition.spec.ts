import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';
import { Resolve } from '@jamashita/publikum-type';

import { UnscharferelationError } from '../../Unscharferelation/Error/UnscharferelationError';
import { Heisenberg } from '../../Unscharferelation/Interface/Heisenberg';
import { Alive } from '../Alive';
import { Dead } from '../Dead';
import { SuperpositionError } from '../Error/SuperpositionError';
import { Schrodinger } from '../Interface/Schrodinger';
import { Still } from '../Still';
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
    it('alive', async () => {
      const value: number = -149;
      const alive: Alive<number, MockError> = Alive.of<number, MockError>(value);

      const superposition: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(alive);

      const schrodinger: Schrodinger<number, MockError> = await superposition.terminate();

      expect(schrodinger.get()).toBe(value);
    });

    it('dead', async () => {
      const error: MockError = new MockError();
      const dead: Dead<number, MockError> = Dead.of<number, MockError>(error);

      const superposition: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(dead);

      const schrodinger: Schrodinger<number, MockError> = await superposition.terminate();

      expect(() => {
        schrodinger.get();
      }).toThrow(MockError);
    });

    it('still', () => {
      const still: Still<number, MockError> = Still.of<number, MockError>();

      expect(() => {
        Superposition.ofSchrodinger<number, MockError>(still);
      }).toThrow(SuperpositionError);
    });
  });

  describe('get', () => {
    it('returns inner value', async () => {
      const value: number = -149;
      const error: MockError = new MockError();

      const superposition1: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Alive.of<number, MockError>(value)
      );
      const superposition2: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Dead.of<number, MockError>(error)
      );

      await expect(superposition1.get()).resolves.toEqual(value);
      await expect(superposition2.get()).rejects.toThrow(MockError);
    });
  });

  describe('terminate', () => {
    it('returns Schrodinger subclass isntance', async () => {
      const value: number = -149;
      const error: MockError = new MockError();

      const alive: Schrodinger<number, MockError> = await Superposition.ofSchrodinger<number, MockError>(
        Alive.of<number, MockError>(value)
      ).terminate();
      const dead: Schrodinger<number, MockError> = await Superposition.ofSchrodinger<number, MockError>(
        Dead.of<number, MockError>(error)
      ).terminate();

      expect(alive).toBeInstanceOf(Alive);
      expect(alive.get()).toBe(value);
      expect(dead).toBeInstanceOf(Dead);
      expect(() => {
        dead.get();
      }).toThrow(MockError);
    });
  });

  describe('filter', () => {
    it('alive: predicate returns true', async () => {
      const value: number = -149;

      const superposition1: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Alive.of<number, MockError>(value)
      );
      const superposition2: Superposition<number, MockError | SuperpositionError> = superposition1.filter(() => {
        return true;
      });

      const shcrodiner: Schrodinger<number, MockError | SuperpositionError> = await superposition2.terminate();

      expect(shcrodiner.isAlive()).toBe(true);
      expect(shcrodiner.get()).toBe(value);
    });

    it('alive: predicate returns false', async () => {
      const value: number = -149;

      const superposition1: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Alive.of<number, MockError>(value)
      );
      const superposition2: Superposition<number, MockError | SuperpositionError> = superposition1.filter(() => {
        return false;
      });

      const shcrodiner: Schrodinger<number, MockError | SuperpositionError> = await superposition2.terminate();

      expect(shcrodiner.isDead()).toBe(true);
      expect(() => {
        shcrodiner.get();
      }).toThrow(SuperpositionError);
    });

    it('dead: returns itself inspite of the return value of filter', async () => {
      const error: MockError = new MockError();

      const superposition1: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Dead.of<number, MockError>(error)
      );
      const superposition2: Superposition<number, MockError | SuperpositionError> = superposition1.filter(() => {
        return true;
      });
      const superposition3: Superposition<number, MockError | SuperpositionError> = superposition1.filter(() => {
        return false;
      });

      const shcrodiner1: Schrodinger<number, MockError | SuperpositionError> = await superposition2.terminate();
      const shcrodiner2: Schrodinger<number, MockError | SuperpositionError> = await superposition3.terminate();

      expect(superposition1).toBe(superposition2);
      expect(shcrodiner1.isDead()).toBe(true);
      expect(() => {
        shcrodiner1.get();
      }).toThrow(MockError);
      expect(superposition1).toBe(superposition3);
      expect(shcrodiner2.isDead()).toBe(true);
      expect(() => {
        shcrodiner2.get();
      }).toThrow(MockError);
    });

    it('still: returns itself inspite of the return value of filter', () => {
      const superposition1: Superposition<void, MockError> = Superposition.playground<void, MockError>(() => {
        return new Promise((resolve: Resolve<void>) => {
          setTimeout(() => {
            resolve();
          }, 30000);
        });
      });
      const superposition2: Superposition<void, MockError | SuperpositionError> = superposition1.filter(() => {
        return true;
      });
      const superposition3: Superposition<void, MockError | SuperpositionError> = superposition1.filter(() => {
        return false;
      });

      expect(superposition1).toBe(superposition2);
      expect(superposition1).toBe(superposition3);
    });
  });

  describe('map', () => {
    it('sync case', async () => {
      const value: number = 2;
      const alive: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Alive.of<number, MockError>(value)
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await alive
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return v + 1;
        })
        .recover<number>(() => {
          spy2();

          return 100;
        })
        .map<void>((v: number) => {
          spy3();
          expect(v).toBe(value + 1);
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('async case', async () => {
      const value: number = 2;
      const alive: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Alive.of<number, MockError>(value)
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await alive
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return Promise.resolve<number>(v + 1);
        })
        .recover<number>(() => {
          spy2();

          return 100;
        })
        .map<void>((v: number) => {
          spy3();
          expect(v).toBe(value + 1);
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('superposition case', async () => {
      const value1: number = 2;
      const value2: number = 200;
      const alive1: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Alive.of<number, MockError>(value1)
      );
      const alive2: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Alive.of<number, MockError>(value2)
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await alive1
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value1);

          return alive2;
        })
        .recover<number>(() => {
          spy2();

          return 100;
        })
        .map<void>((v: number) => {
          spy3();
          expect(v).toBe(value2);
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('sync case: throws error', async () => {
      const value: number = 2;
      const alive: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Alive.of<number, MockError>(value)
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await alive
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          throw new MockError();
        })
        .recover<number>((err: MockError) => {
          spy2();
          expect(err).toBeInstanceOf(MockError);

          return 100;
        })
        .map<void>((v: number) => {
          spy3();
          expect(v).toBe(100);
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('async case: returns rejection', async () => {
      const value: number = 2;
      const alive: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Alive.of<number, MockError>(value)
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await alive
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return Promise.reject<number>(new MockError());
        })
        .recover<number>((err: MockError) => {
          spy2();
          expect(err).toBeInstanceOf(MockError);

          return 100;
        })
        .map<void>((v: number) => {
          spy3();
          expect(v).toBe(100);
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('superposition case: returns Dead Superposition', async () => {
      const value: number = 2;
      const error: MockError = new MockError();
      const alive: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Alive.of<number, MockError>(value)
      );
      const dead: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Dead.of<number, MockError>(error)
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await alive
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return dead;
        })
        .recover<number>((err: MockError) => {
          spy2();
          expect(err).toBe(error);

          return 100;
        })
        .map<void>((v: number) => {
          spy3();
          expect(v).toBe(100);
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('already resoved superposition case', async () => {
      const value: number = 2;
      const alive: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Alive.of<number, MockError>(value)
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await alive
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return alive;
        })
        .recover<number>(() => {
          spy2();

          return 100;
        })
        .map<void>((v: number) => {
          spy3();
          expect(v).toBe(value);
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });

  describe('recover', () => {
    it('sync case', async () => {
      const error: MockError = new MockError();
      const dead: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Dead.of<number, MockError>(error)
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await dead
        .map<number>(() => {
          spy1();

          return 10;
        })
        .recover<number>((err: MockError) => {
          spy2();
          expect(err).toBe(error);

          return 100;
        })
        .map<void>((v: number) => {
          spy3();
          expect(v).toBe(100);
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('async case', async () => {
      const error: MockError = new MockError();
      const dead: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Dead.of<number, MockError>(error)
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await dead
        .map<number>(() => {
          spy1();

          return 10;
        })
        .recover<number>((err: MockError) => {
          spy2();
          expect(err).toBe(error);

          return Promise.resolve<number>(100);
        })
        .map<void>((v: number) => {
          spy3();
          expect(v).toBe(100);
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('superposition case', async () => {
      const error: MockError = new MockError();
      const value: number = 2;
      const dead: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Dead.of<number, MockError>(error)
      );
      const alive: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Alive.of<number, MockError>(value)
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await dead
        .map<number>(() => {
          spy1();

          return alive;
        })
        .recover<number>((err: MockError) => {
          spy2();
          expect(err).toBe(error);

          return alive;
        })
        .map<void>((v: number) => {
          spy3();
          expect(v).toBe(value);
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('sync case: throws error', async () => {
      const error: MockError = new MockError();
      const dead: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Dead.of<number, MockError>(error)
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await dead
        .recover<number>((err: MockError) => {
          spy1();
          expect(err).toBe(error);

          throw new MockError();
        })
        .recover<number>((err: MockError) => {
          spy2();
          expect(err).toBeInstanceOf(MockError);
          expect(err).not.toBe(error);

          return 100;
        })
        .map<void>((v: number) => {
          spy3();
          expect(v).toBe(100);
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('async case: returns rejection', async () => {
      const error: MockError = new MockError();
      const dead: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Dead.of<number, MockError>(error)
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await dead
        .recover<number>((err: MockError) => {
          spy1();
          expect(err).toBe(error);

          return Promise.reject<number>(new MockError());
        })
        .recover<number>((err: MockError) => {
          spy2();
          expect(err).toBeInstanceOf(MockError);
          expect(err).not.toBe(error);

          return 100;
        })
        .map<void>((v: number) => {
          spy3();
          expect(v).toBe(100);
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('superposition case: returns Dead Superposition', async () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const dead1: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Dead.of<number, MockError>(error1)
      );
      const dead2: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Dead.of<number, MockError>(error2)
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await dead1
        .recover<number>((err: MockError) => {
          spy1();
          expect(err).toBe(error1);

          return dead2;
        })
        .recover<number>((err: MockError) => {
          spy2();
          expect(err).toBe(error2);

          return 100;
        })
        .map<void>((v: number) => {
          spy3();
          expect(v).toBe(100);
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('already rejected superposition case', async () => {
      const error: MockError = new MockError();
      const dead: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Dead.of<number, MockError>(error)
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await dead
        .recover<number>((err: MockError) => {
          spy1();
          expect(err).toBe(error);

          return dead;
        })
        .map<number>(() => {
          spy2();

          return 10;
        })
        .recover<void>((err: MockError) => {
          spy3();
          expect(err).toBe(error);
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });

  describe('transform', () => {
    it('alive: sync case', async () => {
      const value: number = 2;
      const alive: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Alive.of<number, MockError>(value)
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await alive
        .transform<number>(
          () => {
            spy1();

            return 10;
          },
          () => {
            spy2();

            return 100;
          }
        )
        .map<void>((v: number) => {
          spy3();
          expect(v).toBe(10);
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('alive: async case', async () => {
      const value: number = 2;
      const alive: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Alive.of<number, MockError>(value)
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await alive
        .transform<number>(
          () => {
            spy1();

            return Promise.resolve<number>(10);
          },
          () => {
            spy2();

            return Promise.resolve<number>(100);
          }
        )
        .map<void>((v: number) => {
          spy3();
          expect(v).toBe(10);
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('alive: superposition case', async () => {
      const value1: number = 2;
      const value2: number = 3;
      const value3: number = 4;
      const alive1: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Alive.of<number, MockError>(value1)
      );
      const alive2: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Alive.of<number, MockError>(value2)
      );
      const alive3: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Alive.of<number, MockError>(value3)
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await alive1
        .transform<number>(
          () => {
            spy1();

            return alive2;
          },
          () => {
            spy2();

            return alive3;
          }
        )
        .map<void>((v: number) => {
          spy3();
          expect(v).toBe(value2);
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('dead: sync case: throws error', async () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const error3: MockError = new MockError();
      const dead: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Dead.of<number, MockError>(error1)
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await dead
        .transform<number>(
          () => {
            spy1();

            throw error2;
          },
          () => {
            spy2();

            throw error3;
          }
        )
        .recover<void>((err: MockError) => {
          spy3();
          expect(err).toBe(error3);
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('async case: returns rejection', async () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const error3: MockError = new MockError();
      const dead: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Dead.of<number, MockError>(error1)
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await dead
        .transform<number>(
          () => {
            spy1();

            return Promise.reject<number>(error2);
          },
          () => {
            spy2();

            return Promise.reject<number>(error3);
          }
        )
        .recover<void>((err: MockError) => {
          spy3();
          expect(err).toBe(error3);
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('superposition case: returns Dead Superposition', async () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const error3: MockError = new MockError();
      const dead1: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Dead.of<number, MockError>(error1)
      );
      const dead2: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Dead.of<number, MockError>(error2)
      );
      const dead3: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Dead.of<number, MockError>(error3)
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await dead1
        .transform<number>(
          () => {
            spy1();

            return dead2;
          },
          () => {
            spy2();

            return dead3;
          }
        )
        .recover((err: MockError) => {
          spy3();
          expect(err).toBe(error3);
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('already resoved superposition case', async () => {
      const value: number = 2;
      const alive: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Alive.of<number, MockError>(value)
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await alive
        .transform<number>(
          () => {
            spy1();

            return alive;
          },
          () => {
            spy2();

            return alive;
          }
        )
        .map<void>((v: number) => {
          spy3();
          expect(v).toBe(value);
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('already rejected superposition case', async () => {
      const error: MockError = new MockError();
      const dead: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Dead.of<number, MockError>(error)
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await dead
        .transform<number>(
          () => {
            spy1();

            return dead;
          },
          () => {
            spy2();

            return dead;
          }
        )
        .recover((err: MockError) => {
          spy3();
          expect(err).toBe(error);
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });
  });

  describe('toUnscharferelation', () => {
    it('alive: will transform to present', async () => {
      const value: number = 2;
      const alive: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Alive.of<number, MockError>(value)
      );

      const heisenberg: Heisenberg<number> = await alive.toUnscharferelation();

      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('dead: will transform to absent', async () => {
      const error: MockError = new MockError();
      const dead: Superposition<number, MockError> = Superposition.ofSchrodinger<number, MockError>(
        Dead.of<number, MockError>(error)
      );

      const heisenberg: Heisenberg<number> = await dead.toUnscharferelation();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });
  });
});
