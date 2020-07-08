import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';

import { Epoque } from '../../Epoque/Interface/Epoque';
import { UnscharferelationError } from '../../Unscharferelation/Error/UnscharferelationError';
import { Heisenberg } from '../../Unscharferelation/Heisenberg/Heisenberg';
import { MockSuperposition } from '../Mock/MockSuperposition';
import { Schrodinger } from '../Schrodinger/Schrodinger';
import { Superposition } from '../Superposition';

describe('Superposition', () => {
  describe('all', () => {
    it('no superpositions', async () => {
      const superpositions: Array<Superposition<number, MockError>> = [];

      const schrodinger: Schrodinger<Array<number>, MockError> = await Superposition.all<number, MockError>(
        superpositions
      ).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get().length).toBe(superpositions.length);
    });

    it('sync: all are Alive', async () => {
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.alive<number, MockError>(0),
        Superposition.alive<number, MockError>(1),
        Superposition.alive<number, MockError>(2)
      ];

      const schrodinger: Schrodinger<Array<number>, MockError> = await Superposition.all<number, MockError>(
        superpositions,
        MockError
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
        Superposition.dead<number, MockError>(error),
        Superposition.alive<number, MockError>(1),
        Superposition.alive<number, MockError>(2)
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
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
        Superposition.alive<number, MockError>(0),
        Superposition.dead<number, MockError>(error),
        Superposition.alive<number, MockError>(2)
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
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
        Superposition.alive<number, MockError>(0),
        Superposition.alive<number, MockError>(1),
        Superposition.dead<number, MockError>(error)
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
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
        Superposition.dead<number, MockError>(error1),
        Superposition.dead<number, MockError>(error2),
        Superposition.alive<number, MockError>(2)
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
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
        Superposition.dead<number, MockError>(error1),
        Superposition.alive<number, MockError>(1),
        Superposition.dead<number, MockError>(error2)
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
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
        Superposition.alive<number, MockError>(0),
        Superposition.dead<number, MockError>(error1),
        Superposition.dead<number, MockError>(error2)
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
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
        Superposition.dead<number, MockError>(error1),
        Superposition.dead<number, MockError>(error2),
        Superposition.dead<number, MockError>(error3)
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
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
        Superposition.alive<number, MockError>(Promise.resolve<number>(0)),
        Superposition.alive<number, MockError>(Promise.resolve<number>(1)),
        Superposition.alive<number, MockError>(Promise.resolve<number>(2))
      ];

      const schrodinger: Schrodinger<Array<number>, MockError> = await Superposition.all<number, MockError>(
        superpositions,
        MockError
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
        Superposition.dead<number, MockError>(Promise.reject<number>(error)),
        Superposition.alive<number, MockError>(Promise.resolve<number>(1)),
        Superposition.alive<number, MockError>(Promise.resolve<number>(2))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
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
        Superposition.alive<number, MockError>(Promise.resolve<number>(0)),
        Superposition.dead<number, MockError>(Promise.reject<number>(error)),
        Superposition.alive<number, MockError>(Promise.resolve<number>(2))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
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
        Superposition.alive<number, MockError>(Promise.resolve<number>(0)),
        Superposition.alive<number, MockError>(Promise.resolve<number>(1)),
        Superposition.dead<number, MockError>(Promise.reject<number>(error))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
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

    it('async: contains more than 1 Dead, but the last one', async () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.dead<number, MockError>(Promise.reject<number>(error1)),
        Superposition.dead<number, MockError>(Promise.reject<number>(error2)),
        Superposition.alive<number, MockError>(Promise.resolve<number>(2))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
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

    it('async: contains more than 1 Dead, but the second one', async () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.dead<number, MockError>(Promise.reject<number>(error1)),
        Superposition.alive<number, MockError>(Promise.resolve<number>(1)),
        Superposition.dead<number, MockError>(Promise.reject<number>(error2))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
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

    it('async: contains more than 1 Dead, but the first one', async () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.alive<number, MockError>(Promise.resolve<number>(0)),
        Superposition.dead<number, MockError>(Promise.reject<number>(error1)),
        Superposition.dead<number, MockError>(Promise.reject<number>(error2))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
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

    it('async: contains more than 1 Dead, all', async () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const error3: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.dead<number, MockError>(Promise.reject<number>(error1)),
        Superposition.dead<number, MockError>(Promise.reject<number>(error2)),
        Superposition.dead<number, MockError>(Promise.reject<number>(error3))
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions,
        MockError
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
    it('sync: Alive case', async () => {
      const value: number = 2;

      const superposition: Superposition<number, MockError> = Superposition.playground<number, MockError>(() => {
        return value;
      }, MockError);

      const schrodinger: Schrodinger<number, MockError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(value);
    });

    it('sync: Dead case', async () => {
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

    it('async: Alive case', async () => {
      const value: number = 2;

      const superposition: Superposition<number, MockError> = Superposition.playground<number, MockError>(() => {
        return Promise.resolve<number>(value);
      }, MockError);

      const schrodinger: Schrodinger<number, MockError> = await superposition.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(value);
    });

    it('async: Dead case', async () => {
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

  describe('alive', () => {
    it('sync', async () => {
      const value: number = -6;

      const alive: Superposition<number, MockError> = Superposition.alive<number, MockError>(value, MockError);
      const schrodinger: Schrodinger<number, MockError> = await alive.terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(value);
    });

    it('async', async () => {
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
      const error: MockError = new MockError();

      const dead: Superposition<number, MockError> = Superposition.dead<number, MockError>(error, MockError);
      const schrodinger: Schrodinger<number, MockError> = await dead.terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });

    it('async', async () => {
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

  describe('pass', () => {
    it('delegate inner Superposition', () => {
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

  describe('toUnscharferelation', () => {
    it('alive: will transform to present', async () => {
      const value: number = 2;

      const superposition: Superposition<number, MockError> = Superposition.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.accept(value);
        },
        MockError
      );

      const heisenberg: Heisenberg<number> = await superposition.toUnscharferelation().terminate();

      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('alive: if the value is undefined, will transform to absent', async () => {
      const value: undefined = undefined;

      const superposition: Superposition<undefined, MockError> = Superposition.of<undefined, MockError>(
        (epoque: Epoque<undefined, MockError>) => {
          epoque.accept(value);
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
      const error: MockError = new MockError();

      const superposition: Superposition<number, MockError> = Superposition.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.decline(error);
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
      const error: MockError = new MockError();

      const superposition: Superposition<number, MockError> = Superposition.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.throw(error);
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
