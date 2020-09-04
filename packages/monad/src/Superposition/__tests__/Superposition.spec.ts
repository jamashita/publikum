import { Heisenberg, UnscharferelationError } from '@jamashita/publikum-monad';
import { MockError } from '@jamashita/publikum-object';
import sinon, { SinonSpy } from 'sinon';
import { Chrono } from '../Chrono/Interface/Chrono';
import { SuperpositionError } from '../Error/SuperpositionError';
import { MockSuperposition } from '../Mock/MockSuperposition';
import { Alive } from '../Schrodinger/Alive';
import { Contradiction } from '../Schrodinger/Contradiction';
import { Dead } from '../Schrodinger/Dead';
import { Schrodinger } from '../Schrodinger/Schrodinger';
import { Still } from '../Schrodinger/Still';
import { Superposition } from '../Superposition';

describe.skip('Superposition', () => {
  describe('all', () => {
    it('no superpositions', async () => {
      expect.assertions(2);
      const superpositions: Array<Superposition<number, MockError>> = [];

      const schrodinger: Schrodinger<Array<number>, MockError> = await Superposition.all<number, MockError>(
        superpositions,
        MockError
      ).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toHaveLength(superpositions.length);
    });

    it('sync: all are Alive', async () => {
      expect.assertions(5);
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.alive<number, MockError>(0, MockError),
        Superposition.alive<number, MockError>(1, MockError),
        Superposition.alive<number, MockError>(2, MockError)
      ];

      const schrodinger: Schrodinger<Array<number>, MockError> = await Superposition.all<number, MockError>(
        superpositions,
        MockError
      ).terminate();

      expect(schrodinger.isAlive()).toBe(true);

      const array: Array<number> = schrodinger.get();

      expect(array).toHaveLength(superpositions.length);
      for (let i: number = 0; i < array.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        const s: Schrodinger<number, MockError> = await superpositions[i].terminate();

        expect(array[i]).toBe(s.get());
      }
    });

    it('sync: contains Dead on first position', async () => {
      expect.assertions(2);
      const error: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.dead<number, MockError>(error, MockError),
        Superposition.alive<number, MockError>(1, MockError),
        Superposition.alive<number, MockError>(2, MockError)
      ];

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('sync: contains Dead on second position', async () => {
      expect.assertions(2);
      const error: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.alive<number, MockError>(0, MockError),
        Superposition.dead<number, MockError>(error, MockError),
        Superposition.alive<number, MockError>(2, MockError)
      ];

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('sync: contains Dead on last position', async () => {
      expect.assertions(2);
      const error: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.alive<number, MockError>(0, MockError),
        Superposition.alive<number, MockError>(1, MockError),
        Superposition.dead<number, MockError>(error, MockError)
      ];

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('sync: contains more than 1 Dead, but the last one', async () => {
      expect.assertions(2);
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.dead<number, MockError>(error1, MockError),
        Superposition.dead<number, MockError>(error2, MockError),
        Superposition.alive<number, MockError>(2, MockError)
      ];

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error1);
    });

    it('sync: contains more than 1 Dead, but the second one', async () => {
      expect.assertions(2);
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.dead<number, MockError>(error1, MockError),
        Superposition.alive<number, MockError>(1, MockError),
        Superposition.dead<number, MockError>(error2, MockError)
      ];

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error1);
    });

    it('sync: contains more than 1 Dead, but the first one', async () => {
      expect.assertions(2);
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.alive<number, MockError>(0, MockError),
        Superposition.dead<number, MockError>(error1, MockError),
        Superposition.dead<number, MockError>(error2, MockError)
      ];

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error1);
    });

    it('sync: contains more than 1 Dead, all', async () => {
      expect.assertions(2);
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const error3: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.dead<number, MockError>(error1, MockError),
        Superposition.dead<number, MockError>(error2, MockError),
        Superposition.dead<number, MockError>(error3, MockError)
      ];

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error1);
    });

    it('async: all are Alive', async () => {
      expect.assertions(5);
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.alive<number, MockError>(Promise.resolve<number>(0), MockError),
        Superposition.alive<number, MockError>(Promise.resolve<number>(1), MockError),
        Superposition.alive<number, MockError>(Promise.resolve<number>(2), MockError)
      ];

      const schrodinger: Schrodinger<Array<number>, MockError> = await Superposition.all<number, MockError>(
        superpositions,
        MockError
      ).terminate();

      expect(schrodinger.isAlive()).toBe(true);

      const array: Array<number> = schrodinger.get();

      expect(array).toHaveLength(superpositions.length);
      for (let i: number = 0; i < array.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        const s: Schrodinger<number, MockError> = await superpositions[i].terminate();

        expect(array[i]).toBe(s.get());
      }
    });

    it('async: contains Dead on first position', async () => {
      expect.assertions(2);
      const error: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.dead<number, MockError>(Promise.reject<number>(error), MockError),
        Superposition.alive<number, MockError>(Promise.resolve<number>(1), MockError),
        Superposition.alive<number, MockError>(Promise.resolve<number>(2), MockError)
      ];

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('async: contains Dead on second position', async () => {
      expect.assertions(2);
      const error: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.alive<number, MockError>(Promise.resolve<number>(0), MockError),
        Superposition.dead<number, MockError>(Promise.reject<number>(error), MockError),
        Superposition.alive<number, MockError>(Promise.resolve<number>(2), MockError)
      ];

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('async: contains Dead on last position', async () => {
      expect.assertions(2);
      const error: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.alive<number, MockError>(Promise.resolve<number>(0), MockError),
        Superposition.alive<number, MockError>(Promise.resolve<number>(1), MockError),
        Superposition.dead<number, MockError>(Promise.reject<number>(error), MockError)
      ];

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('async: contains more than 1 Dead, but the last one', async () => {
      expect.assertions(2);
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.dead<number, MockError>(Promise.reject<number>(error1), MockError),
        Superposition.dead<number, MockError>(Promise.reject<number>(error2), MockError),
        Superposition.alive<number, MockError>(Promise.resolve<number>(2), MockError)
      ];

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error1);
    });

    it('async: contains more than 1 Dead, but the second one', async () => {
      expect.assertions(2);
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.dead<number, MockError>(Promise.reject<number>(error1), MockError),
        Superposition.alive<number, MockError>(Promise.resolve<number>(1), MockError),
        Superposition.dead<number, MockError>(Promise.reject<number>(error2), MockError)
      ];

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error1);
    });

    it('async: contains more than 1 Dead, but the first one', async () => {
      expect.assertions(2);
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.alive<number, MockError>(Promise.resolve<number>(0), MockError),
        Superposition.dead<number, MockError>(Promise.reject<number>(error1), MockError),
        Superposition.dead<number, MockError>(Promise.reject<number>(error2), MockError)
      ];

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error1);
    });

    it('async: contains more than 1 Dead, all', async () => {
      expect.assertions(2);
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const error3: MockError = new MockError();

      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.dead<number, MockError>(Promise.reject<number>(error1), MockError),
        Superposition.dead<number, MockError>(Promise.reject<number>(error2), MockError),
        Superposition.dead<number, MockError>(Promise.reject<number>(error3), MockError)
      ];

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error1);
    });

    it('includes at least one Contradiction, will return Contradiction, Contradiction comes faster than Dead', async () => {
      expect.assertions(2);
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();

      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.of<number, MockError>((chrono: Chrono<number, MockError>) => {
          chrono.throw(error1);
        }, MockError),
        Superposition.dead<number, MockError>(Promise.reject<number>(error2), MockError),
        Superposition.alive<number, MockError>(Promise.resolve<number>(2), MockError)
      ];

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error1);
    });

    it('includes at least one Contradiction, will return Contradiction, Contradiction comes later than Dead', async () => {
      expect.assertions(2);
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();

      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.dead<number, MockError>(Promise.reject<number>(error1), MockError),
        Superposition.of<number, MockError>((chrono: Chrono<number, MockError>) => {
          chrono.throw(error2);
        }, MockError),
        Superposition.alive<number, MockError>(Promise.resolve<number>(2), MockError)
      ];

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error2);
    });
  });

  describe('playground', () => {
    it('sync: Alive case', async () => {
      expect.assertions(2);
      const value: number = 2;

      const superposition: Superposition<number, MockError> = Superposition.playground<number, MockError>(() => {
        return value;
      }, MockError);

      const schrodinger: Schrodinger<number, MockError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(value);
    });

    it('sync: Dead case', async () => {
      expect.assertions(2);
      const error: MockError = new MockError();

      const superposition: Superposition<number, MockError> = Superposition.playground<number, MockError>(() => {
        throw error;
      }, MockError);

      const schrodinger: Schrodinger<number, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('sync: Contradiction case', async () => {
      expect.assertions(2);
      const error: MockError = new MockError();

      const superposition: Superposition<number, MockError> = Superposition.playground<number, MockError>(() => {
        throw error;
      });

      const schrodinger: Schrodinger<number, MockError> = await superposition.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('async: Alive case', async () => {
      expect.assertions(2);
      const value: number = 2;

      const superposition: Superposition<number, MockError> = Superposition.playground<number, MockError>(() => {
        return Promise.resolve<number>(value);
      }, MockError);

      const schrodinger: Schrodinger<number, MockError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(value);
    });

    it('async: Dead case', async () => {
      expect.assertions(2);
      const error: MockError = new MockError();

      const superposition: Superposition<number, MockError> = Superposition.playground<number, MockError>(() => {
        return Promise.reject<number>(error);
      }, MockError);

      const schrodinger: Schrodinger<number, MockError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('async: Contradiction case', async () => {
      expect.assertions(2);
      const error: MockError = new MockError();

      const superposition: Superposition<number, MockError> = Superposition.playground<number, MockError>(() => {
        return Promise.reject<number>(error);
      });

      const schrodinger: Schrodinger<number, MockError> = await superposition.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });
  });

  describe('ofSchrodinger', () => {
    it('alive case', async () => {
      expect.assertions(3);
      const value: number = 2;
      const alive: Alive<number, MockError> = Alive.of<number, MockError>(value);

      const superposition: Superposition<number, MockError> = Superposition.ofSchrodinger(alive, MockError);

      const schrodinger: Schrodinger<number, MockError> = await superposition.terminate();

      expect(schrodinger).not.toBe(alive);
      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(value);
    });

    it('dead case', async () => {
      expect.assertions(3);
      const error: MockError = new MockError();
      const dead: Dead<number, MockError> = Dead.of<number, MockError>(error);

      const superposition: Superposition<number, MockError> = Superposition.ofSchrodinger(dead, MockError);

      const schrodinger: Schrodinger<number, MockError> = await superposition.terminate();

      expect(schrodinger).not.toBe(dead);
      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('contradiction case', async () => {
      expect.assertions(3);
      const contradiction: Contradiction<number, MockError> = Contradiction.of<number, MockError>(null);

      const superposition: Superposition<number, MockError> = Superposition.ofSchrodinger(contradiction, MockError);

      const schrodinger: Schrodinger<number, MockError> = await superposition.terminate();

      expect(schrodinger).not.toBe(contradiction);
      expect(schrodinger.isContradiction()).toBe(true);
      if (schrodinger.isContradiction()) {
        expect(schrodinger.getCause()).toBeNull();
      }
    });

    it('still case', async () => {
      expect.assertions(2);
      const still: Still<number, MockError> = Still.of<number, MockError>();

      const superposition: Superposition<number, MockError> = Superposition.ofSchrodinger(still, MockError);

      const schrodinger: Schrodinger<number, MockError> = await superposition.terminate();

      expect(schrodinger).not.toBe(still);
      expect(() => {
        schrodinger.get();
      }).toThrow(SuperpositionError);
    });
  });

  describe('alive', () => {
    it('sync', async () => {
      expect.assertions(2);
      const value: number = -6;

      const alive: Superposition<number, MockError> = Superposition.alive<number, MockError>(value, MockError);
      const schrodinger: Schrodinger<number, MockError> = await alive.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(value);
    });

    it('async', async () => {
      expect.assertions(2);
      const value: number = -6;

      const alive: Superposition<number, MockError> = Superposition.alive<number, MockError>(
        Promise.resolve<number>(value),
        MockError
      );
      const schrodinger: Schrodinger<number, MockError> = await alive.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(value);
    });

    it('promise is rejected: no error constructors', async () => {
      expect.assertions(2);
      const error: MockError = new MockError();

      const alive: Superposition<number, MockError> = Superposition.alive<number, MockError>(
        Promise.reject<number>(error)
      );
      const schrodinger: Schrodinger<number, MockError> = await alive.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('promise is rejected: error constructor', async () => {
      expect.assertions(2);
      const error: MockError = new MockError();

      const alive: Superposition<number, MockError> = Superposition.alive<number, MockError>(
        Promise.reject<number>(error),
        MockError
      );
      const schrodinger: Schrodinger<number, MockError> = await alive.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });
  });

  describe('dead', () => {
    it('sync', async () => {
      expect.assertions(2);
      const error: MockError = new MockError();

      const dead: Superposition<number, MockError> = Superposition.dead<number, MockError>(error, MockError);
      const schrodinger: Schrodinger<number, MockError> = await dead.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('async', async () => {
      expect.assertions(2);
      const error: MockError = new MockError();

      const dead: Superposition<number, MockError> = Superposition.dead<number, MockError>(
        Promise.reject<number>(error),
        MockError
      );
      const schrodinger: Schrodinger<number, MockError> = await dead.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('promise is rejected: no error constructors', async () => {
      expect.assertions(2);
      const error: MockError = new MockError();

      const dead: Superposition<number, MockError> = Superposition.dead<number, MockError>(
        Promise.reject<number>(error)
      );
      const schrodinger: Schrodinger<number, MockError> = await dead.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('promise is resolved', async () => {
      expect.assertions(2);
      const value: number = -6;

      const dead: Superposition<number, MockError> = Superposition.dead<number, MockError>(
        Promise.resolve<number>(value),
        MockError
      );
      const schrodinger: Schrodinger<number, MockError> = await dead.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(SuperpositionError);
    });

    it('unexpected error given', async () => {
      expect.assertions(2);
      const error: MockError = new MockError();

      const dead: Superposition<number, MockError> = Superposition.dead<number, MockError>(error);
      const schrodinger: Schrodinger<number, MockError> = await dead.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });
  });

  describe('get', () => {
    it('delegate inner Superposition', async () => {
      expect.assertions(1);
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
      expect.assertions(1);
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
      expect.assertions(1);
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
      expect.assertions(1);
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
      expect.assertions(1);
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
      expect.assertions(1);
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

  describe('pass', () => {
    it('delegate inner Superposition', () => {
      expect.assertions(1);
      const mock: MockSuperposition<number, MockError> = new MockSuperposition<number, MockError>();

      const spy: SinonSpy = sinon.spy();

      mock.pass = spy;

      const superposition: Superposition<number, MockError> = Superposition.ofSuperposition<number, MockError>(mock);

      superposition.pass(
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
    it('delegate inner Superposition', () => {
      expect.assertions(1);
      const mock: MockSuperposition<number, MockError> = new MockSuperposition<number, MockError>();

      const spy: SinonSpy = sinon.spy();

      mock.peek = spy;

      const superposition: Superposition<number, MockError> = Superposition.ofSuperposition<number, MockError>(mock);

      superposition.peek(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe.skip('toUnscharferelation', () => {
    it('alive: will transform to present', async () => {
      expect.assertions(2);
      const value: number = 2;

      const superposition: Superposition<number, MockError> = Superposition.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value);
        },
        MockError
      );

      const heisenberg: Heisenberg<number> = await superposition.toUnscharferelation().terminate();

      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('alive: if the value is undefined, will transform to absent', async () => {
      expect.assertions(2);
      const value: undefined = undefined;

      const superposition: Superposition<undefined, MockError> = Superposition.of<undefined, MockError>(
        (chrono: Chrono<undefined, MockError>) => {
          chrono.accept(value);
        },
        MockError
      );

      const heisenberg: Heisenberg<undefined> = await superposition.toUnscharferelation().terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('dead: will transform to absent', async () => {
      expect.assertions(2);
      const error: MockError = new MockError();

      const superposition: Superposition<number, MockError> = Superposition.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.decline(error);
        },
        MockError
      );

      const heisenberg: Heisenberg<number> = await superposition.toUnscharferelation().terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('contradiction: will transform to lost', async () => {
      expect.assertions(2);
      const error: MockError = new MockError();

      const superposition: Superposition<number, MockError> = Superposition.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.throw(error);
        },
        MockError
      );

      const heisenberg: Heisenberg<number> = await superposition.toUnscharferelation().terminate();

      expect(heisenberg.isLost()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(error);
    });
  });
});
