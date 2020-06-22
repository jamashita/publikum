import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';

import { Schrodinger } from '../Interface/Schrodinger';
import { Superposition } from '../Superposition';

describe('Superposition', () => {
  describe('all', () => {
    it('all are Alive', async () => {
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.alive<number, MockError>(0),
        Superposition.alive<number, MockError>(1),
        Superposition.alive<number, MockError>(2)
      ];

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.get();

      expect(schrodinger.isAlive()).toBe(true);

      const array: Array<number> = schrodinger.get();

      expect(array.length).toBe(superpositions.length);
      for (let i: number = 0; i < array.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        const s: Schrodinger<number, MockError> = await superpositions[i].get();

        expect(array[i]).toBe(s.get());
      }
    });

    it('no superpositions', async () => {
      const superpositions: Array<Superposition<number, MockError>> = [];

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.get();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get().length).toBe(superpositions.length);
    });

    it('contains Dead on first position', async () => {
      const error: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.dead<number, MockError>(error),
        Superposition.alive<number, MockError>(1),
        Superposition.alive<number, MockError>(2)
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.get();

      expect(schrodinger.isDead()).toBe(true);

      await superposition
        .map<void>(() => {
          spy1();
        })
        .recover<void>((err: MockError) => {
          spy2();
          expect(err).toBe(error);
        });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('contains Dead on second position', async () => {
      const error: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.alive<number, MockError>(0),
        Superposition.dead<number, MockError>(error),
        Superposition.alive<number, MockError>(2)
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.get();

      expect(schrodinger.isDead()).toBe(true);

      await superposition
        .map<void>(() => {
          spy1();
        })
        .recover<void>((err: MockError) => {
          spy2();
          expect(err).toBe(error);
        });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('contains Dead on last position', async () => {
      const error: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Superposition.alive<number, MockError>(0),
        Superposition.alive<number, MockError>(1),
        Superposition.dead<number, MockError>(error)
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.get();

      expect(schrodinger.isDead()).toBe(true);

      await superposition
        .map<void>(() => {
          spy1();
        })
        .recover<void>((err: MockError) => {
          spy2();
          expect(err).toBe(error);
        });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('contains more than 1 Dead, returns the first one', async () => {
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
        superpositions
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.get();

      expect(schrodinger.isDead()).toBe(true);

      await superposition
        .map<void>(() => {
          spy1();
        })
        .recover<void>((err: MockError) => {
          spy2();
          expect(err).toBe(error1);
        });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('contains more than 1 Dead, returns the first one - 2', async () => {
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
        superpositions
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.get();

      expect(schrodinger.isDead()).toBe(true);

      await superposition
        .map<void>(() => {
          spy1();
        })
        .recover<void>((err: MockError) => {
          spy2();
          expect(err).toBe(error1);
        });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('contains more than 1 Dead, returns the first one - 4', async () => {
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
        superpositions
      );

      const schrodinger: Schrodinger<Array<number>, MockError> = await superposition.get();

      expect(schrodinger.isDead()).toBe(true);

      await superposition
        .map<void>(() => {
          spy1();
        })
        .recover((err: MockError) => {
          spy2();
          expect(err).toBe(error1);
        });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('playground', () => {
    it('alive case', async () => {
      const v: number = 2;
      const superposition: Superposition<number, MockError> = Superposition.playground<number, MockError>(() => {
        return v;
      });

      const schrodinger: Schrodinger<number, MockError> = await superposition.get();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(v);
    });

    it('dead case', async () => {
      const e: MockError = new MockError();
      const superposition: Superposition<number, MockError> = Superposition.playground<number, MockError>(() => {
        throw e;
      });

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const schrodinger: Schrodinger<number, MockError> = await superposition.get();

      expect(schrodinger.isDead()).toBe(true);

      await superposition
        .map<void>(() => {
          spy1();
        })
        .recover<void>((err: MockError) => {
          spy2();
          expect(e).toBe(err);
        });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('promise alive case', async () => {
      const v: number = 2;
      const superposition: Superposition<number, MockError> = Superposition.playground<number, MockError>(
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          return v;
        }
      );

      const schrodinger: Schrodinger<number, MockError> = await superposition.get();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(v);
    });

    it('promise dead case', async () => {
      const e: MockError = new MockError();
      const superposition: Superposition<number, MockError> = Superposition.playground<number, MockError>(
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          throw e;
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const schrodinger: Schrodinger<number, MockError> = await superposition.get();

      expect(schrodinger.isDead()).toBe(true);

      await superposition
        .map<void>(() => {
          spy1();
        })
        .recover<void>((err: MockError) => {
          spy2();
          expect(e).toBe(err);
        });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('superposition case', () => {
      const alive: Superposition<number, MockError> = Superposition.alive<number, MockError>(2);
      const dead: Superposition<number, MockError> = Superposition.dead<number, MockError>(new MockError());

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

  describe('alive', () => {
    it('sync case', async () => {
      const value: number = 1010;
      const superposition: Superposition<number, MockError> = Superposition.alive<number, MockError>(value);

      const schrodinger: Schrodinger<number, MockError> = await superposition.get();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(value);
    });

    it('async case', async () => {
      const value: number = 1010;
      const superposition: Superposition<number, MockError> = Superposition.alive<number, MockError>(
        Promise.resolve<number>(value)
      );

      const schrodinger: Schrodinger<number, MockError> = await superposition.get();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(value);
    });

    it('superposition case: returns itself', () => {
      const alive: Superposition<number, MockError> = Superposition.alive(1010);
      const dead: Superposition<number, MockError> = Superposition.dead(new MockError());

      const superposition1: Superposition<number, MockError> = Superposition.alive<number, MockError>(alive);
      const superposition2: Superposition<number, MockError> = Superposition.alive<number, MockError>(dead);

      expect(superposition1).toBe(alive);
      expect(superposition2).toBe(dead);
    });
  });

  describe('dead', () => {
    it('sync case', async () => {
      const error: MockError = new MockError();
      const superposition: Superposition<number, MockError> = Superposition.dead<number, MockError>(error);

      const schrodinger: Schrodinger<number, MockError> = await superposition.get();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MockError);
    });

    it('async case', async () => {
      const error: MockError = new MockError();
      const superposition: Superposition<number, MockError> = Superposition.dead<number, MockError>(
        Promise.reject<number>(error)
      );

      const schrodinger: Schrodinger<number, MockError> = await superposition.get();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MockError);
    });

    it('superposition case: returns itself', () => {
      const alive: Superposition<number, MockError> = Superposition.alive(1010);
      const dead: Superposition<number, MockError> = Superposition.dead(new MockError());

      const superposition1: Superposition<number, MockError> = Superposition.dead<number, MockError>(alive);
      const superposition2: Superposition<number, MockError> = Superposition.dead<number, MockError>(dead);

      expect(superposition1).toBe(alive);
      expect(superposition2).toBe(dead);
    });
  });

  describe('ofPromise', () => {
    it('resolved case', async () => {
      const value: number = 2;
      const promise: Promise<number> = Promise.resolve<number>(value);
      const superposition: Superposition<number, MockError> = Superposition.ofPromise(promise);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      await superposition
        .map<void>((v: number) => {
          spy1();
          expect(v).toBe(value);
        })
        .recover<void>(() => {
          spy2();
        });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });
  });

  describe('map', () => {
    it('alive: sync case', async () => {
      const value: number = 2;
      const alive: Superposition<number, MockError> = Superposition.alive<number, MockError>(value);

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
        });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('alive: async case', async () => {
      const value: number = 2;
      const alive: Superposition<number, MockError> = Superposition.alive<number, MockError>(value);

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
        });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
