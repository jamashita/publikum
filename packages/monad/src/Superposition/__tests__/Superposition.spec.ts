import { MockRuntimeError } from '@jamashita/publikum-error';
import { MockValueObject } from '@jamashita/publikum-object';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { UnscharferelationError } from '../../Unscharferelation/Error/UnscharferelationError';
import { Heisenberg } from '../../Unscharferelation/Heisenberg/Heisenberg';
import { Chrono } from '../Chrono/Interface/Chrono';
import { SuperpositionError } from '../Error/SuperpositionError';
import { MockSuperposition } from '../Mock/MockSuperposition';
import { Alive } from '../Schrodinger/Alive';
import { Contradiction } from '../Schrodinger/Contradiction';
import { Dead } from '../Schrodinger/Dead';
import { Schrodinger } from '../Schrodinger/Schrodinger';
import { Still } from '../Schrodinger/Still';
import { Superposition } from '../Superposition';

describe('Superposition', () => {
  describe('equals', () => {
    it('returns true if the same instance given', () => {
      expect.assertions(1);

      const superposition: Superposition<number, MockRuntimeError> = Superposition.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(-1);
        },
        MockRuntimeError
      );

      expect(superposition.equals(superposition)).toBe(true);
    });

    it('returns false if the different class instance given', () => {
      expect.assertions(1);

      const superposition: Superposition<number, MockRuntimeError> = Superposition.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(-1);
        },
        MockRuntimeError
      );

      expect(superposition.equals(new MockValueObject('mock'))).toBe(false);
    });

    it('returns true if their retaining Schrodingers are the same', () => {
      expect.assertions(5);

      const superposition1: Superposition<number, MockRuntimeError> = Superposition.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(-1);
        },
        MockRuntimeError
      );
      const superposition2: Superposition<number, MockRuntimeError> = Superposition.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(-1);
        },
        MockRuntimeError
      );
      const superposition3: Superposition<number, MockRuntimeError> = Superposition.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(0);
        },
        MockRuntimeError
      );
      const superposition4: Superposition<number, MockRuntimeError> = Superposition.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(new MockRuntimeError());
        },
        MockRuntimeError
      );
      const superposition5: Superposition<number, MockRuntimeError> = Superposition.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(null);
        },
        MockRuntimeError
      );

      expect(superposition1.equals(superposition1)).toBe(true);
      expect(superposition1.equals(superposition2)).toBe(true);
      expect(superposition1.equals(superposition3)).toBe(false);
      expect(superposition1.equals(superposition4)).toBe(false);
      expect(superposition1.equals(superposition5)).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns its retaining Schrodinger string', () => {
      expect.assertions(3);

      const superposition1: Superposition<number, MockRuntimeError> = Superposition.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(-1);
        },
        MockRuntimeError
      );
      const superposition2: Superposition<number, MockRuntimeError> = Superposition.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(new MockRuntimeError());
        },
        MockRuntimeError
      );
      const superposition3: Superposition<number, MockRuntimeError> = Superposition.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(null);
        },
        MockRuntimeError
      );

      expect(superposition1.toString()).toBe('Alive: -1');
      expect(superposition2.toString()).toBe('Dead: MockRuntimeError { noun: \'MockRuntimeError\' }');
      expect(superposition3.toString()).toBe('Contradiction: null');
    });
  });

  describe('all', () => {
    it('no Superpositions', async () => {
      expect.assertions(2);

      const superpositions: Array<Superposition<number, MockRuntimeError>> = [];

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await Superposition.all<number, MockRuntimeError>(superpositions).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toHaveLength(superpositions.length);
    });

    it('sync: all are Alive', async () => {
      expect.assertions(5);

      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.alive<number, MockRuntimeError>(0, MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(1, MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(2, MockRuntimeError)
      ];

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await Superposition.all<number, MockRuntimeError>(superpositions).terminate();

      expect(schrodinger.isAlive()).toBe(true);

      const array: Array<number> = schrodinger.get();

      expect(array).toHaveLength(superpositions.length);
      for (let i: number = 0; i < array.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        const s: Schrodinger<number, MockRuntimeError> = await superpositions[i].terminate();

        expect(array[i]).toBe(s.get());
      }
    });

    it('sync: contains Dead on first position', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();
      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.dead<number, MockRuntimeError>(error, MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(1, MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(2, MockRuntimeError)
      ];

      const superposition: Superposition<Array<number>, MockRuntimeError> = Superposition.all<number, MockRuntimeError>(superpositions);

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('sync: contains Dead on second position', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();
      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.alive<number, MockRuntimeError>(0, MockRuntimeError),
        Superposition.dead<number, MockRuntimeError>(error, MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(2, MockRuntimeError)
      ];

      const superposition: Superposition<Array<number>, MockRuntimeError> = Superposition.all<number, MockRuntimeError>(superpositions);

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('sync: contains Dead on last position', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();
      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.alive<number, MockRuntimeError>(0, MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(1, MockRuntimeError),
        Superposition.dead<number, MockRuntimeError>(error, MockRuntimeError)
      ];

      const superposition: Superposition<Array<number>, MockRuntimeError> = Superposition.all<number, MockRuntimeError>(superpositions);

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('sync: contains more than 1 Dead, but the last one', async () => {
      expect.assertions(2);

      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.dead<number, MockRuntimeError>(error1, MockRuntimeError),
        Superposition.dead<number, MockRuntimeError>(error2, MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(2, MockRuntimeError)
      ];

      const superposition: Superposition<Array<number>, MockRuntimeError> = Superposition.all<number, MockRuntimeError>(superpositions);

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error1);
    });

    it('sync: contains more than 1 Dead, but the second one', async () => {
      expect.assertions(2);

      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.dead<number, MockRuntimeError>(error1, MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(1, MockRuntimeError),
        Superposition.dead<number, MockRuntimeError>(error2, MockRuntimeError)
      ];

      const superposition: Superposition<Array<number>, MockRuntimeError> = Superposition.all<number, MockRuntimeError>(superpositions);

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error1);
    });

    it('sync: contains more than 1 Dead, but the first one', async () => {
      expect.assertions(2);

      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.alive<number, MockRuntimeError>(0, MockRuntimeError),
        Superposition.dead<number, MockRuntimeError>(error1, MockRuntimeError),
        Superposition.dead<number, MockRuntimeError>(error2, MockRuntimeError)
      ];

      const superposition: Superposition<Array<number>, MockRuntimeError> = Superposition.all<number, MockRuntimeError>(superpositions);

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error1);
    });

    it('sync: contains more than 1 Dead, all', async () => {
      expect.assertions(2);

      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const error3: MockRuntimeError = new MockRuntimeError();
      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.dead<number, MockRuntimeError>(error1, MockRuntimeError),
        Superposition.dead<number, MockRuntimeError>(error2, MockRuntimeError),
        Superposition.dead<number, MockRuntimeError>(error3, MockRuntimeError)
      ];

      const superposition: Superposition<Array<number>, MockRuntimeError> = Superposition.all<number, MockRuntimeError>(superpositions);

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error1);
    });

    it('async: all are Alive', async () => {
      expect.assertions(5);

      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.alive<number, MockRuntimeError>(Promise.resolve<number>(0), MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(Promise.resolve<number>(1), MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(Promise.resolve<number>(2), MockRuntimeError)
      ];

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await Superposition.all<number, MockRuntimeError>(superpositions).terminate();

      expect(schrodinger.isAlive()).toBe(true);

      const array: Array<number> = schrodinger.get();

      expect(array).toHaveLength(superpositions.length);
      for (let i: number = 0; i < array.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        const s: Schrodinger<number, MockRuntimeError> = await superpositions[i].terminate();

        expect(array[i]).toBe(s.get());
      }
    });

    it('async: contains Dead on first position', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();
      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.dead<number, MockRuntimeError>(Promise.reject<number>(error), MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(Promise.resolve<number>(1), MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(Promise.resolve<number>(2), MockRuntimeError)
      ];

      const superposition: Superposition<Array<number>, MockRuntimeError> = Superposition.all<number, MockRuntimeError>(superpositions);

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('async: contains Dead on second position', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();
      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.alive<number, MockRuntimeError>(Promise.resolve<number>(0), MockRuntimeError),
        Superposition.dead<number, MockRuntimeError>(Promise.reject<number>(error), MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(Promise.resolve<number>(2), MockRuntimeError)
      ];

      const superposition: Superposition<Array<number>, MockRuntimeError> = Superposition.all<number, MockRuntimeError>(superpositions);

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('async: contains Dead on last position', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();
      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.alive<number, MockRuntimeError>(Promise.resolve<number>(0), MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(Promise.resolve<number>(1), MockRuntimeError),
        Superposition.dead<number, MockRuntimeError>(Promise.reject<number>(error), MockRuntimeError)
      ];

      const superposition: Superposition<Array<number>, MockRuntimeError> = Superposition.all<number, MockRuntimeError>(superpositions);

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('async: contains more than 1 Dead, but the last one', async () => {
      expect.assertions(2);

      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.dead<number, MockRuntimeError>(Promise.reject<number>(error1), MockRuntimeError),
        Superposition.dead<number, MockRuntimeError>(Promise.reject<number>(error2), MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(Promise.resolve<number>(2), MockRuntimeError)
      ];

      const superposition: Superposition<Array<number>, MockRuntimeError> = Superposition.all<number, MockRuntimeError>(superpositions);

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error1);
    });

    it('async: contains more than 1 Dead, but the second one', async () => {
      expect.assertions(2);

      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.dead<number, MockRuntimeError>(Promise.reject<number>(error1), MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(Promise.resolve<number>(1), MockRuntimeError),
        Superposition.dead<number, MockRuntimeError>(Promise.reject<number>(error2), MockRuntimeError)
      ];

      const superposition: Superposition<Array<number>, MockRuntimeError> = Superposition.all<number, MockRuntimeError>(superpositions);

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error1);
    });

    it('async: contains more than 1 Dead, but the first one', async () => {
      expect.assertions(2);

      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.alive<number, MockRuntimeError>(Promise.resolve<number>(0), MockRuntimeError),
        Superposition.dead<number, MockRuntimeError>(Promise.reject<number>(error1), MockRuntimeError),
        Superposition.dead<number, MockRuntimeError>(Promise.reject<number>(error2), MockRuntimeError)
      ];

      const superposition: Superposition<Array<number>, MockRuntimeError> = Superposition.all<number, MockRuntimeError>(superpositions);

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error1);
    });

    it('async: contains more than 1 Dead, all', async () => {
      expect.assertions(2);

      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const error3: MockRuntimeError = new MockRuntimeError();

      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.dead<number, MockRuntimeError>(Promise.reject<number>(error1), MockRuntimeError),
        Superposition.dead<number, MockRuntimeError>(Promise.reject<number>(error2), MockRuntimeError),
        Superposition.dead<number, MockRuntimeError>(Promise.reject<number>(error3), MockRuntimeError)
      ];

      const superposition: Superposition<Array<number>, MockRuntimeError> = Superposition.all<number, MockRuntimeError>(superpositions);

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error1);
    });

    it('includes at least one Contradiction, will return Contradiction, Contradiction comes faster than Dead', async () => {
      expect.assertions(2);

      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();

      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error1);
        }, MockRuntimeError),
        Superposition.dead<number, MockRuntimeError>(Promise.reject<number>(error2), MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(Promise.resolve<number>(2), MockRuntimeError)
      ];

      const superposition: Superposition<Array<number>, MockRuntimeError> = Superposition.all<number, MockRuntimeError>(superpositions);

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error1);
    });

    it('includes at least one Contradiction, will return Contradiction, Contradiction comes later than Dead', async () => {
      expect.assertions(2);

      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();

      const superpositions: Array<Superposition<number, MockRuntimeError>> = [
        Superposition.dead<number, MockRuntimeError>(Promise.reject<number>(error1), MockRuntimeError),
        Superposition.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error2);
        }, MockRuntimeError),
        Superposition.alive<number, MockRuntimeError>(Promise.resolve<number>(2), MockRuntimeError)
      ];

      const superposition: Superposition<Array<number>, MockRuntimeError> = Superposition.all<number, MockRuntimeError>(superpositions);

      const schrodinger: Schrodinger<Array<number>, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error2);
    });
  });

  describe('anyway', () => {
    it('all Alive', async () => {
      expect.assertions(4);

      const superposition1: Superposition<number, MockRuntimeError> = Superposition.alive<number, MockRuntimeError>(-1);
      const superposition2: Superposition<number, MockRuntimeError> = Superposition.alive<number, MockRuntimeError>(0);
      const superposition3: Superposition<number, MockRuntimeError> = Superposition.alive<number, MockRuntimeError>(1);
      const superpositions: Array<Superposition<number, MockRuntimeError>> = [superposition1, superposition2, superposition3];

      const schrodingers: Array<Schrodinger<number, MockRuntimeError>> = await Superposition.anyway<number, MockRuntimeError>(superpositions);

      expect(schrodingers).toHaveLength(superpositions.length);
      for (let i: number = 0; i < superpositions.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        const schrodinger: Schrodinger<number, MockRuntimeError> = await superpositions[i].terminate();

        expect(schrodingers[i].equals(schrodinger)).toBe(true);
      }
    });

    it('all Dead', async () => {
      expect.assertions(4);

      const superposition1: Superposition<number, MockRuntimeError> = Superposition.dead<number, MockRuntimeError>(new MockRuntimeError());
      const superposition2: Superposition<number, MockRuntimeError> = Superposition.dead<number, MockRuntimeError>(new MockRuntimeError());
      const superposition3: Superposition<number, MockRuntimeError> = Superposition.dead<number, MockRuntimeError>(new MockRuntimeError());
      const superpositions: Array<Superposition<number, MockRuntimeError>> = [superposition1, superposition2, superposition3];

      const schrodingers: Array<Schrodinger<number, MockRuntimeError>> = await Superposition.anyway<number, MockRuntimeError>(superpositions);

      expect(schrodingers).toHaveLength(superpositions.length);
      for (let i: number = 0; i < superpositions.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        const schrodinger: Schrodinger<number, MockRuntimeError> = await superpositions[i].terminate();

        expect(schrodingers[i].equals(schrodinger)).toBe(true);
      }
    });

    it('all Contradiction', async () => {
      expect.assertions(4);

      const superposition1: Superposition<number, MockRuntimeError> = Superposition.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(null);
      });
      const superposition2: Superposition<number, MockRuntimeError> = Superposition.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(undefined);
      });
      const superposition3: Superposition<number, MockRuntimeError> = Superposition.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(NaN);
      });
      const superpositions: Array<Superposition<number, MockRuntimeError>> = [superposition1, superposition2, superposition3];

      const schrodingers: Array<Schrodinger<number, MockRuntimeError>> = await Superposition.anyway<number, MockRuntimeError>(superpositions);

      expect(schrodingers).toHaveLength(superpositions.length);
      for (let i: number = 0; i < superpositions.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        const schrodinger: Schrodinger<number, MockRuntimeError> = await superpositions[i].terminate();

        expect(schrodingers[i].equals(schrodinger)).toBe(true);
      }
    });

    it('all in one', async () => {
      expect.assertions(4);

      const superposition1: Superposition<number, MockRuntimeError> = Superposition.of<number, MockRuntimeError>((chrono: Chrono<number, MockRuntimeError>) => {
        chrono.throw(null);
      });
      const superposition2: Superposition<number, MockRuntimeError> = Superposition.dead<number, MockRuntimeError>(new MockRuntimeError());
      const superposition3: Superposition<number, MockRuntimeError> = Superposition.alive<number, MockRuntimeError>(1);
      const superpositions: Array<Superposition<number, MockRuntimeError>> = [superposition1, superposition2, superposition3];

      const schrodingers: Array<Schrodinger<number, MockRuntimeError>> = await Superposition.anyway<number, MockRuntimeError>(superpositions);

      expect(schrodingers).toHaveLength(superpositions.length);
      for (let i: number = 0; i < superpositions.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        const schrodinger: Schrodinger<number, MockRuntimeError> = await superpositions[i].terminate();

        expect(schrodingers[i].equals(schrodinger)).toBe(true);
      }
    });
  });

  describe('playground', () => {
    it('sync: Alive case', async () => {
      expect.assertions(2);

      const value: number = 2;

      const superposition: Superposition<number, MockRuntimeError> = Superposition.playground<number, MockRuntimeError>(() => {
        return value;
      }, MockRuntimeError);

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(value);
    });

    it('sync: Dead case', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: Superposition<number, MockRuntimeError> = Superposition.playground<number, MockRuntimeError>(() => {
        throw error;
      }, MockRuntimeError);

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('sync: Contradiction case', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: Superposition<number, MockRuntimeError> = Superposition.playground<number, MockRuntimeError>(() => {
        throw error;
      });

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('async: Alive case', async () => {
      expect.assertions(2);

      const value: number = 2;

      const superposition: Superposition<number, MockRuntimeError> = Superposition.playground<number, MockRuntimeError>(() => {
        return Promise.resolve<number>(value);
      }, MockRuntimeError);

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(value);
    });

    it('async: Dead case', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: Superposition<number, MockRuntimeError> = Superposition.playground<number, MockRuntimeError>(() => {
        return Promise.reject<number>(error);
      }, MockRuntimeError);

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('async: Contradiction case', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: Superposition<number, MockRuntimeError> = Superposition.playground<number, MockRuntimeError>(() => {
        return Promise.reject<number>(error);
      });

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });
  });

  describe('ofSchrodinger', () => {
    it('Alive case', async () => {
      expect.assertions(3);

      const value: number = 2;
      const alive: Alive<number, MockRuntimeError> = Alive.of<number, MockRuntimeError>(value);

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSchrodinger(alive, MockRuntimeError);

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger).not.toBe(alive);
      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(value);
    });

    it('Dead case', async () => {
      expect.assertions(3);

      const error: MockRuntimeError = new MockRuntimeError();
      const dead: Dead<number, MockRuntimeError> = Dead.of<number, MockRuntimeError>(error);

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSchrodinger(dead, MockRuntimeError);

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger).not.toBe(dead);
      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('Contradiction case', async () => {
      expect.assertions(3);

      const contradiction: Contradiction<number, MockRuntimeError> = Contradiction.of<number, MockRuntimeError>(null);

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSchrodinger(contradiction, MockRuntimeError);

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger).not.toBe(contradiction);
      expect(schrodinger.isContradiction()).toBe(true);
      if (schrodinger.isContradiction()) {
        expect(schrodinger.getCause()).toBeNull();
      }
    });

    it('Still case', async () => {
      expect.assertions(2);

      const still: Still<number, MockRuntimeError> = Still.of<number, MockRuntimeError>();

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSchrodinger(still, MockRuntimeError);

      const schrodinger: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

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

      const alive: Superposition<number, MockRuntimeError> = Superposition.alive<number, MockRuntimeError>(value, MockRuntimeError);
      const schrodinger: Schrodinger<number, MockRuntimeError> = await alive.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(value);
    });

    it('async', async () => {
      expect.assertions(2);

      const value: number = -6;

      const alive: Superposition<number, MockRuntimeError> = Superposition.alive<number, MockRuntimeError>(
        Promise.resolve<number>(value),
        MockRuntimeError
      );
      const schrodinger: Schrodinger<number, MockRuntimeError> = await alive.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(value);
    });

    it('Promise is rejected: no error constructors', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const alive: Superposition<number, MockRuntimeError> = Superposition.alive<number, MockRuntimeError>(
        Promise.reject<number>(error)
      );
      const schrodinger: Schrodinger<number, MockRuntimeError> = await alive.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('Promise is rejected: error constructor', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const alive: Superposition<number, MockRuntimeError> = Superposition.alive<number, MockRuntimeError>(
        Promise.reject<number>(error),
        MockRuntimeError
      );
      const schrodinger: Schrodinger<number, MockRuntimeError> = await alive.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });
  });

  describe('dead', () => {
    it('sync', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const dead: Superposition<number, MockRuntimeError> = Superposition.dead<number, MockRuntimeError>(error, MockRuntimeError);
      const schrodinger: Schrodinger<number, MockRuntimeError> = await dead.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('async', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const dead: Superposition<number, MockRuntimeError> = Superposition.dead<number, MockRuntimeError>(
        Promise.reject<number>(error),
        MockRuntimeError
      );
      const schrodinger: Schrodinger<number, MockRuntimeError> = await dead.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('Promise is rejected: no error constructors', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const dead: Superposition<number, MockRuntimeError> = Superposition.dead<number, MockRuntimeError>(
        Promise.reject<number>(error)
      );
      const schrodinger: Schrodinger<number, MockRuntimeError> = await dead.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('Promise is resolved', async () => {
      expect.assertions(2);

      const value: number = -6;

      const dead: Superposition<number, MockRuntimeError> = Superposition.dead<number, MockRuntimeError>(
        Promise.resolve<number>(value),
        MockRuntimeError
      );
      const schrodinger: Schrodinger<number, MockRuntimeError> = await dead.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(SuperpositionError);
    });

    it('unexpected error given', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const dead: Superposition<number, MockRuntimeError> = Superposition.dead<number, MockRuntimeError>(error);
      const schrodinger: Schrodinger<number, MockRuntimeError> = await dead.terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });
  });

  describe('get', () => {
    it('delegates inner Superposition', async () => {
      expect.assertions(1);

      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition<number, MockRuntimeError>();

      const spy: SinonSpy = sinon.spy();

      mock.get = spy;

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSuperposition<number, MockRuntimeError>(mock);

      await superposition.get();

      expect(spy.called).toBe(true);
    });
  });

  describe('terminate', () => {
    it('delegates inner Superposition', async () => {
      expect.assertions(1);

      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition<number, MockRuntimeError>();

      const spy: SinonSpy = sinon.spy();

      mock.terminate = spy;

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSuperposition<number, MockRuntimeError>(mock);

      await superposition.terminate();

      expect(spy.called).toBe(true);
    });
  });

  describe('filter', () => {
    it('delegates inner Superposition', () => {
      expect.assertions(1);

      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition<number, MockRuntimeError>();

      const spy: SinonSpy = sinon.spy();

      mock.filter = spy;

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSuperposition<number, MockRuntimeError>(mock);

      superposition.filter(() => {
        return true;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('map', () => {
    it('delegates inner Superposition', () => {
      expect.assertions(2);

      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition<number, MockRuntimeError>();

      const spy: SinonSpy = sinon.spy();
      const stub: SinonStub = sinon.stub();

      mock.map = spy;
      mock.getErrors = stub;
      stub.returns([]);

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSuperposition<number, MockRuntimeError>(mock);

      superposition.map<number, MockRuntimeError>((v: number) => {
        return v + 2;
      });

      expect(spy.called).toBe(true);
      expect(stub.called).toBe(true);
    });
  });

  describe('recover', () => {
    it('delegates inner Superposition', () => {
      expect.assertions(1);

      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition<number, MockRuntimeError>();

      const spy: SinonSpy = sinon.spy();

      mock.recover = spy;

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSuperposition<number, MockRuntimeError>(mock);

      superposition.recover<number, MockRuntimeError>(() => {
        return 2;
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('transform', () => {
    it('delegates inner Superposition', () => {
      expect.assertions(1);

      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition<number, MockRuntimeError>();

      const spy: SinonSpy = sinon.spy();

      mock.transform = spy;

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSuperposition<number, MockRuntimeError>(mock);

      superposition.transform<number, MockRuntimeError>(
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

  describe('ifAlive', () => {
    it('delegates inner Superposition', () => {
      expect.assertions(1);

      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition<number, MockRuntimeError>();

      const spy: SinonSpy = sinon.spy();

      mock.ifAlive = spy;

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSuperposition<number, MockRuntimeError>(mock);

      superposition.ifAlive(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('ifDead', () => {
    it('delegates inner Superposition', () => {
      expect.assertions(1);

      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition<number, MockRuntimeError>();

      const spy: SinonSpy = sinon.spy();

      mock.ifDead = spy;

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSuperposition<number, MockRuntimeError>(mock);

      superposition.ifDead(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('ifContradiction', () => {
    it('delegates inner Superposition', () => {
      expect.assertions(1);

      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition<number, MockRuntimeError>();

      const spy: SinonSpy = sinon.spy();

      mock.ifContradiction = spy;

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSuperposition<number, MockRuntimeError>(mock);

      superposition.ifContradiction(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('pass', () => {
    it('delegates inner Superposition', () => {
      expect.assertions(1);

      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition<number, MockRuntimeError>();

      const spy: SinonSpy = sinon.spy();

      mock.pass = spy;

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSuperposition<number, MockRuntimeError>(mock);

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
    it('delegates inner Superposition', () => {
      expect.assertions(1);

      const mock: MockSuperposition<number, MockRuntimeError> = new MockSuperposition<number, MockRuntimeError>();

      const spy: SinonSpy = sinon.spy();

      mock.peek = spy;

      const superposition: Superposition<number, MockRuntimeError> = Superposition.ofSuperposition<number, MockRuntimeError>(mock);

      superposition.peek(() => {
        // NOOP
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('toUnscharferelation', () => {
    it('Alive: will transform to Present', async () => {
      expect.assertions(2);

      const value: number = 2;

      const superposition: Superposition<number, MockRuntimeError> = Superposition.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        MockRuntimeError
      );

      const heisenberg: Heisenberg<number> = await superposition.toUnscharferelation().terminate();

      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('Alive: if the value is undefined, will transform to Absent', async () => {
      expect.assertions(2);

      const value: undefined = undefined;

      const superposition: Superposition<undefined, MockRuntimeError> = Superposition.of<undefined, MockRuntimeError>(
        (chrono: Chrono<undefined, MockRuntimeError>) => {
          chrono.accept(value);
        },
        MockRuntimeError
      );

      const heisenberg: Heisenberg<undefined> = await superposition.toUnscharferelation().terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('Dead: will transform to Absent', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: Superposition<number, MockRuntimeError> = Superposition.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        MockRuntimeError
      );

      const heisenberg: Heisenberg<number> = await superposition.toUnscharferelation().terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('Contradiction: will transform to Lost', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: Superposition<number, MockRuntimeError> = Superposition.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        },
        MockRuntimeError
      );

      const heisenberg: Heisenberg<number> = await superposition.toUnscharferelation().terminate();

      expect(heisenberg.isLost()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(error);
    });
  });
});
