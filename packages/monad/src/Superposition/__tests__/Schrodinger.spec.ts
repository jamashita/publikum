import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';

import { Alive } from '../Alive';
import { Dead } from '../Dead';
import { Schrodinger } from '../Schrodinger';
import { Superposition } from '../Superposition';

describe('Schrodinger', () => {
  describe('all', () => {
    it('all are Alive', () => {
      const superpositions: Array<Superposition<number, MockError>> = [
        Alive.of<number, MockError>(0),
        Alive.of<number, MockError>(1),
        Alive.of<number, MockError>(2)
      ];

      const values: Superposition<Array<number>, MockError> = Schrodinger.all<number, MockError>(superpositions);

      expect(values.isAlive()).toBe(true);
      const array: Array<number> = values.get();

      expect(array.length).toBe(superpositions.length);
      for (let i: number = 0; i < array.length; i++) {
        expect(array[i]).toBe(superpositions[i].get());
      }
    });

    it('no superpositions', () => {
      const superpositions: Array<Superposition<number, MockError>> = [];

      const values: Superposition<Array<number>, MockError> = Schrodinger.all<number, MockError>(superpositions);

      expect(values.isAlive()).toBe(true);
      const array: Array<number> = values.get();

      expect(array.length).toBe(superpositions.length);
    });

    it('contains Dead on first position', () => {
      const error: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Dead.of<number, MockError>(error),
        Alive.of<number, MockError>(1),
        Alive.of<number, MockError>(2)
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const values: Superposition<Array<number>, MockError> = Schrodinger.all<number, MockError>(superpositions);

      expect(values.isDead()).toBe(true);
      values.transform<void>(
        () => {
          spy1();
        },
        (err: MockError) => {
          spy2();
          expect(err).toBe(error);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('contains Dead on second position', () => {
      const error: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Alive.of<number, MockError>(0),
        Dead.of<number, MockError>(error),
        Alive.of<number, MockError>(2)
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const values: Superposition<Array<number>, MockError> = Schrodinger.all<number, MockError>(superpositions);

      expect(values.isDead()).toBe(true);
      values.transform<void>(
        () => {
          spy1();
        },
        (err: MockError) => {
          spy2();
          expect(err).toBe(error);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('contains Dead on last position', () => {
      const error: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Alive.of<number, MockError>(0),
        Alive.of<number, MockError>(1),
        Dead.of<number, MockError>(error)
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const values: Superposition<Array<number>, MockError> = Schrodinger.all<number, MockError>(superpositions);

      expect(values.isDead()).toBe(true);
      values.transform<void>(
        () => {
          spy1();
        },
        (err: MockError) => {
          spy2();
          expect(err).toBe(error);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('contains more than 1 Dead, returns the first one', () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Dead.of<number, MockError>(error1),
        Dead.of<number, MockError>(error2),
        Alive.of<number, MockError>(2)
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const values: Superposition<Array<number>, MockError> = Schrodinger.all<number, MockError>(superpositions);

      expect(values.isDead()).toBe(true);
      values.transform<void>(
        () => {
          spy1();
        },
        (err: MockError) => {
          spy2();
          expect(err).toBe(error1);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('contains more than 1 Dead, returns the first one - 2', () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Dead.of<number, MockError>(error1),
        Alive.of<number, MockError>(1),
        Dead.of<number, MockError>(error2)
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const values: Superposition<Array<number>, MockError> = Schrodinger.all<number, MockError>(superpositions);

      expect(values.isDead()).toBe(true);
      values.transform<void>(
        () => {
          spy1();
        },
        (err: MockError) => {
          spy2();
          expect(err).toBe(error1);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('contains more than 1 Dead, returns the first one - 4', () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const error3: MockError = new MockError();
      const superpositions: Array<Superposition<number, MockError>> = [
        Dead.of<number, MockError>(error1),
        Dead.of<number, MockError>(error2),
        Dead.of<number, MockError>(error3)
      ];

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const values: Superposition<Array<number>, MockError> = Schrodinger.all<number, MockError>(superpositions);

      expect(values.isDead()).toBe(true);
      values.transform<void>(
        () => {
          spy1();
        },
        (err: MockError) => {
          spy2();
          expect(err).toBe(error1);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('playground', () => {
    it('alive case', () => {
      const v: number = 2;
      const superposition: Superposition<number, MockError> = Schrodinger.playground<number, MockError>(() => {
        return v;
      });

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get()).toBe(v);
    });

    it('dead case', () => {
      const e: MockError = new MockError();
      const superposition: Superposition<number, MockError> = Schrodinger.playground<number, MockError>(() => {
        throw e;
      });

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      expect(superposition.isDead()).toBe(true);
      superposition.transform<void>(
        () => {
          spy1();
        },
        (err: MockError) => {
          spy2();
          expect(e).toBe(err);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('superposition case', () => {
      const alive: Alive<number, MockError> = Alive.of<number, MockError>(2);
      const dead: Dead<number, MockError> = Dead.of<number, MockError>(new MockError());
      const superposition1: Superposition<number, MockError> = Schrodinger.playground<number, MockError>(() => {
        return alive;
      });
      const superposition2: Superposition<number, MockError> = Schrodinger.playground<number, MockError>(() => {
        return dead;
      });

      expect(superposition1).toBe(alive);
      expect(superposition2).toBe(dead);
    });
  });

  describe('sandbox', () => {
    it('alive case', async () => {
      const v: number = 2;
      const superposition: Superposition<number, MockError> = await Schrodinger.sandbox<number, MockError>(
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          return v;
        }
      );

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get()).toBe(v);
    });

    it('dead case', async () => {
      const e: MockError = new MockError();
      const superposition: Superposition<number, MockError> = await Schrodinger.sandbox<number, MockError>(
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          throw e;
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      // expect(superposition.isDead()).toBe(true);
      superposition.transform<void>(
        () => {
          spy1();
        },
        (err: MockError) => {
          spy2();
          expect(e).toBe(err);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('superposition case', async () => {
      const alive: Alive<number, MockError> = Alive.of<number, MockError>(2);
      const dead: Dead<number, MockError> = Dead.of<number, MockError>(new MockError());
      const superposition1: Superposition<number, MockError> = await Schrodinger.sandbox<number, MockError>(
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          return alive;
        }
      );
      const superposition2: Superposition<number, MockError> = await Schrodinger.sandbox<number, MockError>(
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          return dead;
        }
      );

      expect(superposition1).toBe(alive);
      expect(superposition2).toBe(dead);
    });
  });
});
