import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';

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

      const array: Array<number> = await superposition.get();

      expect(array.length).toBe(superpositions.length);
      for (let i: number = 0; i < array.length; i++) {
        expect(array[i]).toBe(superpositions[i].get());
      }
    });

    it('no superpositions', async () => {
      const superpositions: Array<Superposition<number, MockError>> = [];

      const superposition: Superposition<Array<number>, MockError> = Superposition.all<number, MockError>(
        superpositions
      );

      const array: Array<number> = await superposition.get();

      expect(array.length).toBe(superpositions.length);
    });

    it('contains Dead on first position', () => {
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

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      superposition
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

    it('contains Dead on second position', () => {
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

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      superposition
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

    it('contains Dead on last position', () => {
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

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      superposition
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

    it('contains more than 1 Dead, returns the first one', () => {
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

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      superposition
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

    it('contains more than 1 Dead, returns the first one - 2', () => {
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

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      superposition
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

    it('contains more than 1 Dead, returns the first one - 4', () => {
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

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      superposition
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

      await expect(superposition.get()).resolves.toBe(v);
    });

    it('dead case', () => {
      const e: MockError = new MockError();
      const superposition: Superposition<number, MockError> = Superposition.playground<number, MockError>(() => {
        throw e;
      });

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      superposition
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

    it('promise alive case', async () => {
      const v: number = 2;
      const superposition: Superposition<number, MockError> = Superposition.playground<number, MockError>(
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          return v;
        }
      );

      await expect(superposition.get()).resolves.toBe(v);
    });

    it('promise dead case', () => {
      const e: MockError = new MockError();
      const superposition: Superposition<number, MockError> = Superposition.playground<number, MockError>(
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          throw e;
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      superposition
        .map<void>(() => {
          spy1();
        })
        .recover<void>((err: MockError) => {
          spy2();
          expect(e).toBe(err);
        })
        .settled(() => {
          expect(spy1.called).toBe(false);
          expect(spy2.called).toBe(true);
        });
    });

    it('promise superposition case', () => {
      const alive: Superposition<number, MockError> = Superposition.alive<number, MockError>(2);
      const dead: Superposition<number, MockError> = Superposition.dead<number, MockError>(new MockError());

      const superposition1: Superposition<number, MockError> = Superposition.playground<number, MockError>(
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          return alive;
        }
      );
      const superposition2: Superposition<number, MockError> = Superposition.playground<number, MockError>(
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          return dead;
        }
      );

      superposition1.settled(() => {
        expect(superposition1).toBe(alive);
      });
      superposition2.settled(() => {
        expect(superposition2).toBe(dead);
      });
    });
  });

  describe('map', () => {
    it('alive: sync case', () => {
      const value: number = 2;
      const alive: Superposition<number, MockError> = Superposition.alive<number, MockError>(value);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      alive
        .map((v: number) => {
          spy1();
          expect(v).toBe(value);

          return v + 1;
        })
        .map((v: number) => {
          spy2();
          expect(v).toBe(value + 1);
        })
        .settled(() => {
          expect(spy1.called).toBe(true);
          expect(spy2.called).toBe(true);
        });
    });

    it('alive: async case', () => {
      const value: number = 2;
      const alive: Superposition<number, MockError> = Superposition.alive<number, MockError>(value);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      alive
        .map((v: number) => {
          spy1();
          expect(v).toBe(value);

          return Promise.resolve<number>(v + 1);
        })
        .map((v: number) => {
          spy2();
          expect(v).toBe(value + 1);
        })
        .settled(() => {
          expect(spy1.called).toBe(true);
          expect(spy2.called).toBe(true);
        });
    });
  });
});
