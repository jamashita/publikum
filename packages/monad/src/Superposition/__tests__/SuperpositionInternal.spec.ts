import { MockRuntimeError } from '@jamashita/publikum-error';
import sinon, { SinonSpy } from 'sinon';
import { UnscharferelationError } from '../../Unscharferelation/Error/UnscharferelationError';
import { Heisenberg } from '../../Unscharferelation/Heisenberg/Heisenberg';
import { Chrono } from '../Chrono/Interface/Chrono';
import { SuperpositionError } from '../Error/SuperpositionError';
import { Schrodinger } from '../Schrodinger/Schrodinger';
import { SuperpositionInternal } from '../SuperpositionInternal';

describe('SuperpositionInternal', () => {
  describe('equals', () => {
    it('returns true if their retaining Schrodingers are the same', () => {
      expect.assertions(5);
      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(-1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(-1);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(0);
        },
        [MockRuntimeError]
      );
      const superposition4: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(new MockRuntimeError());
        },
        [MockRuntimeError]
      );
      const superposition5: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(null);
        },
        [MockRuntimeError]
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
      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(-1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(new MockRuntimeError());
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(null);
        },
        [MockRuntimeError]
      );

      expect(superposition1.toString()).toBe('Alive: -1');
      expect(superposition2.toString()).toBe('Dead: MockRuntimeError { noun: \'MockRuntimeError\' }');
      expect(superposition3.toString()).toBe('Contradiction: null');
    });
  });

  describe('accept', () => {
    it('if done once, do nothing', async () => {
      expect.assertions(2);
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<void, MockRuntimeError> = SuperpositionInternal.of<void, MockRuntimeError>(
        (chrono: Chrono<void, MockRuntimeError>) => {
          chrono.accept();
        },
        [MockRuntimeError]
      );

      const schrodinger1: Schrodinger<void, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger1.isAlive()).toBe(true);

      superposition.decline(error);

      const schrodinger2: Schrodinger<void, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger2.isAlive()).toBe(true);
    });

    it('call multiple maps', async () => {
      expect.assertions(4);
      const value: number = -1.3;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );

      await superposition.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return v + 4;
      }).terminate();

      await superposition.map<number>((v: number) => {
        spy2();
        expect(v).toBe(value);

        return v + 3;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });
  });

  describe('decline', () => {
    it('if done once, do nothing', async () => {
      expect.assertions(2);
      const error: MockRuntimeError = new MockRuntimeError();
      const value: number = -1.3;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      const schrodinger1: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger1.isDead()).toBe(true);

      superposition.accept(value);

      const schrodinger2: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger2.isDead()).toBe(true);
    });

    it('call multiple maps', async () => {
      expect.assertions(2);
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      await superposition.recover<number, MockRuntimeError>(() => {
        spy1();

        return 4;
      }).terminate();

      await superposition.recover<number, MockRuntimeError>(() => {
        spy2();

        return 3;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });
  });

  describe('throw', () => {
    it('if done once, do nothing', async () => {
      expect.assertions(2);
      const value: number = -1.3;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        },
        [MockRuntimeError]
      );

      const schrodinger1: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger1.isContradiction()).toBe(true);

      superposition.accept(value);

      const schrodinger2: Schrodinger<number, MockRuntimeError> = await superposition.terminate();

      expect(schrodinger2.isContradiction()).toBe(true);
    });

    it('call multiple maps', async () => {
      expect.assertions(4);
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        },
        [MockRuntimeError]
      );

      await superposition.map<number, MockRuntimeError>(() => {
        spy1();

        return 4;
      }).terminate();

      await superposition.recover<number, MockRuntimeError>(() => {
        spy2();

        return 3;
      }).terminate();

      await superposition.map<number, MockRuntimeError>(() => {
        spy3();

        return 2;
      }).terminate();

      await superposition.recover<number, MockRuntimeError>(() => {
        spy4();

        return 1;
      }).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });
  });

  describe('get', () => {
    it('returns inner value', async () => {
      expect.assertions(3);
      const value: number = -149;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        },
        [MockRuntimeError]
      );

      await expect(superposition1.get()).resolves.toStrictEqual(value);
      await expect(superposition2.get()).rejects.toThrow(error);
      await expect(superposition3.get()).rejects.toThrow(error);
    });
  });

  describe('terminate', () => {
    it('returns Schrodinger subclass isntance', async () => {
      expect.assertions(6);
      const value: number = -149;
      const error: MockRuntimeError = new MockRuntimeError();

      const alive: Schrodinger<number, MockRuntimeError> = await SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      ).terminate();
      const dead: Schrodinger<number, MockRuntimeError> = await SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      ).terminate();
      const contradiction: Schrodinger<number, MockRuntimeError> = await SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        },
        [MockRuntimeError]
      ).terminate();

      expect(alive.isAlive()).toBe(true);
      expect(alive.get()).toBe(value);
      expect(dead.isDead()).toBe(true);
      expect(() => {
        dead.get();
      }).toThrow(error);
      expect(contradiction.isContradiction()).toBe(true);
      expect(() => {
        contradiction.get();
      }).toThrow(error);
    });
  });

  describe('filter', () => {
    it('alive: predicate returns true', async () => {
      expect.assertions(2);
      const value: number = -149;

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError | SuperpositionError> = superposition1.filter(
        () => {
          return true;
        }
      );

      const shcrodiner: Schrodinger<number, MockRuntimeError | SuperpositionError> = await superposition2.terminate();

      expect(shcrodiner.isAlive()).toBe(true);
      expect(shcrodiner.get()).toBe(value);
    });

    it('alive: predicate returns false', async () => {
      expect.assertions(2);
      const value: number = -149;

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError | SuperpositionError> = superposition1.filter(
        () => {
          return false;
        }
      );

      const shcrodiner: Schrodinger<number, MockRuntimeError | SuperpositionError> = await superposition2.terminate();

      expect(shcrodiner.isDead()).toBe(true);
      expect(() => {
        shcrodiner.get();
      }).toThrow(SuperpositionError);
    });

    it('dead: returns its copy inspite of the return value of filter', async () => {
      expect.assertions(4);
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError | SuperpositionError> = superposition1.filter(
        () => {
          return true;
        }
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError | SuperpositionError> = superposition1.filter(
        () => {
          return false;
        }
      );

      const shcrodiner1: Schrodinger<number, MockRuntimeError | SuperpositionError> = await superposition2.terminate();
      const shcrodiner2: Schrodinger<number, MockRuntimeError | SuperpositionError> = await superposition3.terminate();

      expect(shcrodiner1.isDead()).toBe(true);
      expect(() => {
        shcrodiner1.get();
      }).toThrow(error);
      expect(shcrodiner2.isDead()).toBe(true);
      expect(() => {
        shcrodiner2.get();
      }).toThrow(error);
    });

    it('contradiction: returns its copy', async () => {
      expect.assertions(4);
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError | SuperpositionError> = superposition1.filter(
        () => {
          return true;
        }
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError | SuperpositionError> = superposition1.filter(
        () => {
          return false;
        }
      );

      const shcrodiner1: Schrodinger<number, MockRuntimeError | SuperpositionError> = await superposition2.terminate();
      const shcrodiner2: Schrodinger<number, MockRuntimeError | SuperpositionError> = await superposition3.terminate();

      expect(shcrodiner1.isContradiction()).toBe(true);
      expect(() => {
        shcrodiner1.get();
      }).toThrow(error);
      expect(shcrodiner2.isContradiction()).toBe(true);
      expect(() => {
        shcrodiner2.get();
      }).toThrow(error);
    });
  });

  describe('map', () => {
    it('sync case', async () => {
      expect.assertions(6);
      const value: number = 2;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return v + 1;
      }).map<number, MockRuntimeError>((v: number) => {
        spy2();
        expect(v).toBe(value + 1);

        return v + 1;
      }).map<number, MockRuntimeError>((v: number) => {
        spy3();
        expect(v).toBe(value + 2);

        return v + 1;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('async case', async () => {
      expect.assertions(6);
      const value: number = 2;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.resolve<number>(v + 1);
      }).map<number, MockRuntimeError>((v: number) => {
        spy2();
        expect(v).toBe(value + 1);

        return Promise.resolve<number>(v + 2);
      }).map<number, MockRuntimeError>((v: number) => {
        spy3();
        expect(v).toBe(value + 2);

        return Promise.resolve<number>(v + 1);
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('alive Superposition case', async () => {
      expect.assertions(5);
      const value1: number = 2;
      const value2: number = 200;
      const value3: number = 20000;

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value2);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value3);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value1);

        return superposition2;
      }).map<number, MockRuntimeError>(() => {
        spy2();

        return superposition3;
      }).map<number, MockRuntimeError>((v: number) => {
        spy3();
        expect(v).toBe(value3);

        return superposition3;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('sync case: throws error', async () => {
      expect.assertions(4);
      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        throw error;
      }).map<number, MockRuntimeError>(() => {
        spy2();

        throw error;
      }).map<number, MockRuntimeError>(() => {
        spy3();

        throw error;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });

    it('async case: returns Promise rejection', async () => {
      expect.assertions(4);
      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.reject<number>(error);
      }).map<number, MockRuntimeError>(() => {
        spy2();

        return Promise.reject<number>(error);
      }).map<number, MockRuntimeError>(() => {
        spy3();

        return Promise.reject<number>(error);
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });

    it('dead Superposition case', async () => {
      expect.assertions(4);
      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return superposition2;
      }).map<number, MockRuntimeError>(() => {
        spy2();

        return superposition3;
      }).map<number, MockRuntimeError>(() => {
        spy3();

        return superposition3;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });

    it('sync case: throws unexpected error', async () => {
      expect.assertions(5);
      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        []
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await superposition.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        throw error;
      }).map<number, MockRuntimeError>(() => {
        spy2();

        throw error;
      }).map<number, MockRuntimeError>(() => {
        spy3();

        throw error;
      }).recover<number, MockRuntimeError>(() => {
        spy4();

        throw error;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('async case: returns unexpected Promise reject', async () => {
      expect.assertions(5);
      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        []
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await superposition.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.reject<number>(error);
      }).map<number, MockRuntimeError>(() => {
        spy2();

        return Promise.reject<number>(error);
      }).map<number, MockRuntimeError>(() => {
        spy3();

        return Promise.reject<number>(error);
      }).recover<number, MockRuntimeError>(() => {
        spy4();

        return Promise.reject<number>(error);
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('contradiction Superposition case', async () => {
      expect.assertions(5);
      const value: number = 2;
      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const error3: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error1);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error2);
        },
        [MockRuntimeError]
      );
      const superposition4: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error3);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await superposition1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return superposition2;
      }).map<number, MockRuntimeError>(() => {
        spy2();

        return superposition3;
      }).map<number, MockRuntimeError>(() => {
        spy3();

        return superposition4;
      }, MockRuntimeError).recover<number, MockRuntimeError>(() => {
        spy4();

        return superposition4;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('already accepted Superposition case', async () => {
      expect.assertions(6);
      const value1: number = 2;
      const value2: number = 20;

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value2);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition1.map<number, MockRuntimeError>((v: number) => {
        spy1();
        expect(v).toBe(value1);

        return superposition2;
      }).map<number, MockRuntimeError>((v: number) => {
        spy2();
        expect(v).toBe(value2);

        return superposition2;
      }).map<number, MockRuntimeError>((v: number) => {
        spy3();
        expect(v).toBe(value2);

        return superposition2;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('already declined Superposition case', async () => {
      expect.assertions(4);
      const value1: number = 2;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition1.map<number, MockRuntimeError>((v: number) => {
        spy1();
        expect(v).toBe(value1);

        return superposition2;
      }).recover<number, MockRuntimeError>(() => {
        spy2();

        return superposition2;
      }).recover<number, MockRuntimeError>(() => {
        spy3();

        return superposition2;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('already thrown Superposition case', async () => {
      expect.assertions(4);
      const value1: number = 2;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition1.map<number, MockRuntimeError>((v: number) => {
        spy1();
        expect(v).toBe(value1);

        return superposition2;
      }).recover<number, MockRuntimeError>(() => {
        spy2();

        return superposition2;
      }, MockRuntimeError).map<number, MockRuntimeError>((v: number) => {
        spy3();
        expect(v).toBe(value1);

        return superposition2;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });
  });

  describe('recover', () => {
    it('sync case', async () => {
      expect.assertions(5);
      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition.map<number, MockRuntimeError>((v: number) => {
        spy1();

        return v + 1;
      }, MockRuntimeError).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        spy2();
        expect(err).toBe(error);

        return value + 13;
      }, MockRuntimeError).map<number, MockRuntimeError>((v: number) => {
        spy3();
        expect(v).toBe(value + 13);

        return value + 130;
      }).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('async case', async () => {
      expect.assertions(5);
      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition.map<number, MockRuntimeError>((v: number) => {
        spy1();

        return Promise.resolve<number>(v + 1);
      }).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        spy2();
        expect(err).toBe(error);

        return Promise.resolve<number>(value + 13);
      }, MockRuntimeError).map<number, MockRuntimeError>((v: number) => {
        spy3();
        expect(v).toBe(v + 13);

        return Promise.resolve<number>(v + 130);
      }).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('alive Superposition case', async () => {
      expect.assertions(5);
      const value1: number = 2;
      const value2: number = 20;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value2);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition1.map<number, MockRuntimeError>(() => {
        spy1();

        return superposition2;
      }).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        spy2();
        expect(err).toBe(error);

        return superposition3;
      }, MockRuntimeError).map<number, MockRuntimeError>((v: number) => {
        spy3();
        expect(v).toBe(value2);

        return superposition3;
      }).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('sync case: throws error', async () => {
      expect.assertions(6);
      const value: number = 2;
      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error1);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition.recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        spy1();
        expect(err).toBe(error1);

        throw error2;
      }, MockRuntimeError).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        spy2();
        expect(err).toBe(error2);

        return value + 13;
      }, MockRuntimeError).map<number, MockRuntimeError>((v: number) => {
        spy3();
        expect(v).toBe(value + 13);

        return value + 130;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('async case: returns Promise rejection', async () => {
      expect.assertions(6);
      const value: number = 2;
      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error1);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition.recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        spy1();
        expect(err).toBe(error1);

        return Promise.reject<number>(error2);
      }, MockRuntimeError).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        spy2();
        expect(err).toBe(error2);

        return value + 13;
      }, MockRuntimeError).map<number, MockRuntimeError>((v: number) => {
        spy3();
        expect(v).toBe(value + 13);

        return value + 130;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('dead Superposition case', async () => {
      expect.assertions(5);
      const value: number = 2;
      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error1);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error2);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition1.map<number, MockRuntimeError>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return superposition2;
      }).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        spy2();
        expect(err).toBe(error1);

        return superposition3;
      }, MockRuntimeError).map<number, MockRuntimeError>((v: number) => {
        spy3();
        expect(v).toBe(v + 13);

        return superposition3;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('sync case: throws unexpected error', async () => {
      expect.assertions(5);
      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        []
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await superposition.map<number, MockRuntimeError>((v: number) => {
        spy1();
        expect(v).toBe(value);

        throw error;
      }).recover<number, MockRuntimeError>(() => {
        spy2();

        return value + 13;
      }, MockRuntimeError).map<number, MockRuntimeError>(() => {
        spy3();

        return value + 130;
      }).recover<number, MockRuntimeError>(() => {
        spy4();

        return value + 13;
      }, MockRuntimeError).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('async case: returns unexpected Promise rejection', async () => {
      expect.assertions(5);
      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        []
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await superposition.map<number, MockRuntimeError>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.reject<number>(error);
      }).recover<number, MockRuntimeError>(() => {
        spy2();

        return Promise.reject<number>(error);
      }, MockRuntimeError).map<number, MockRuntimeError>(() => {
        spy3();

        return Promise.reject<number>(error);
      }, MockRuntimeError).recover<number, MockRuntimeError>(() => {
        spy4();

        return Promise.reject<number>(error);
      }, MockRuntimeError).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('contradiction Superposition case', async () => {
      expect.assertions(5);
      const value: number = 2;
      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const error3: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error1);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error2);
        },
        [MockRuntimeError]
      );
      const superposition4: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error3);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await superposition1.map<number, MockRuntimeError>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return superposition2;
      }).recover<number, MockRuntimeError>(() => {
        spy2();

        return superposition3;
      }, MockRuntimeError).map<number, MockRuntimeError>(() => {
        spy3();

        return superposition4;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('already accepted superposition case', async () => {
      expect.assertions(6);
      const value1: number = 2;
      const value2: number = 2;

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition1.map<number, MockRuntimeError>((v: number) => {
        spy1();
        expect(v).toBe(value1);

        return superposition2;
      }).map<number>((v: number) => {
        spy2();
        expect(v).toBe(value2);

        return superposition2;
      }).map<number, MockRuntimeError>((v: number) => {
        spy3();
        expect(v).toBe(value2);

        return superposition2;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('already declined superposition case', async () => {
      expect.assertions(6);
      const value: number = 2;
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition1.map<number, MockRuntimeError>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return superposition2;
      }).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        spy2();
        expect(err).toBe(error);

        return superposition2;
      }, MockRuntimeError).recover<number, MockRuntimeError>((err: MockRuntimeError) => {
        spy3();
        expect(err).toBe(error);

        return superposition2;
      }, MockRuntimeError).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });
  });

  describe('transform', () => {
    it('alive: sync case', async () => {
      expect.assertions(6);
      const value1: number = 2;
      const value2: number = 20;
      const value3: number = 200;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await superposition.transform<number, MockRuntimeError>(
        (v: number) => {
          spy1();
          expect(v).toBe(value1);

          return value2;
        },
        () => {
          spy2();

          return value3;
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        (v: number) => {
          spy3();
          expect(v).toBe(value2);

          return value2;
        },
        () => {
          spy4();

          return value3;
        },
        MockRuntimeError
      ).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('alive: async case', async () => {
      expect.assertions(6);
      const value1: number = 2;
      const value2: number = 20;
      const value3: number = 200;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await superposition.transform<number, MockRuntimeError>(
        (v: number) => {
          spy1();
          expect(v).toBe(value1);

          return Promise.resolve<number>(value2);
        },
        () => {
          spy2();

          return Promise.resolve<number>(value3);
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        (v: number) => {
          spy3();
          expect(v).toBe(value2);

          return Promise.resolve<number>(value2);
        },
        () => {
          spy4();

          return Promise.resolve<number>(value3);
        },
        MockRuntimeError
      ).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('alive Superposition case', async () => {
      expect.assertions(6);
      const value1: number = 2;
      const value2: number = 20;
      const value3: number = 200;

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value2);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value3);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await superposition1.transform<number, MockRuntimeError>(
        (v: number) => {
          spy1();
          expect(v).toBe(value1);

          return superposition2;
        },
        () => {
          spy2();

          return superposition3;
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        (v: number) => {
          spy3();
          expect(v).toBe(value2);

          return superposition2;
        },
        () => {
          spy4();

          return superposition3;
        },
        MockRuntimeError
      ).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('dead: sync case: throws error', async () => {
      expect.assertions(5);
      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const error3: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error1);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await superposition.transform<number, MockRuntimeError>(
        () => {
          spy1();

          throw error2;
        },
        (err: MockRuntimeError) => {
          spy2();
          expect(err).toBe(error1);

          throw error3;
        }
      ).transform<number, MockRuntimeError>(
        () => {
          spy3();

          throw error2;
        },
        (err: MockRuntimeError) => {
          spy4();
          expect(err).toBe(error1);

          throw error3;
        }
      ).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('async case: returns rejection', async () => {
      expect.assertions(6);
      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const error3: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error1);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await superposition.transform<number, MockRuntimeError>(
        () => {
          spy1();

          return Promise.reject<number>(error2);
        },
        (err: MockRuntimeError) => {
          spy2();
          expect(err).toBe(error1);

          return Promise.reject<number>(error3);
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        () => {
          spy3();

          return Promise.reject<number>(error2);
        },
        (err: MockRuntimeError) => {
          spy4();
          expect(err).toBe(error1);

          return Promise.reject<number>(error3);
        },
        MockRuntimeError
      ).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('dead Superposition case', async () => {
      expect.assertions(6);
      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const error3: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error2);
        },
        [MockRuntimeError]
      );
      const superposition3: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error3);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await superposition1.transform<number, MockRuntimeError>(
        () => {
          spy1();

          return superposition2;
        },
        (err: MockRuntimeError) => {
          spy2();
          expect(err).toBe(error1);

          return superposition3;
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        () => {
          spy3();

          return superposition2;
        },
        (err: MockRuntimeError) => {
          spy4();
          expect(err).toBe(error1);

          return superposition3;
        },
        MockRuntimeError
      ).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('already accepted superposition case', async () => {
      expect.assertions(9);
      const value1: number = 2;
      const value2: number = 2;

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value2);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();
      const spy5: SinonSpy = sinon.spy();
      const spy6: SinonSpy = sinon.spy();

      await superposition1.transform<number, MockRuntimeError>(
        (v: number) => {
          spy1();
          expect(v).toBe(value1);

          return superposition2;
        },
        () => {
          spy2();

          return superposition2;
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        (v: number) => {
          spy3();
          expect(v).toBe(value2);

          return superposition2;
        },
        () => {
          spy4();

          return superposition2;
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        (v: number) => {
          spy5();
          expect(v).toBe(value2);

          return superposition2;
        },
        () => {
          spy6();

          return superposition2;
        },
        MockRuntimeError
      ).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
      expect(spy5.called).toBe(true);
      expect(spy6.called).toBe(false);
    });

    it('already declined superposition case', async () => {
      expect.assertions(9);
      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error2);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();
      const spy5: SinonSpy = sinon.spy();
      const spy6: SinonSpy = sinon.spy();

      await superposition1.transform<number, MockRuntimeError>(
        () => {
          spy1();

          return superposition2;
        },
        (err: MockRuntimeError) => {
          spy2();
          expect(err).toBe(error1);

          return superposition2;
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        () => {
          spy3();

          return superposition2;
        },
        (err: MockRuntimeError) => {
          spy4();
          expect(err).toBe(error2);

          return superposition2;
        },
        MockRuntimeError
      ).transform<number, MockRuntimeError>(
        () => {
          spy5();

          return superposition2;
        },
        (err: MockRuntimeError) => {
          spy6();
          expect(err).toBe(error2);

          return superposition2;
        },
        MockRuntimeError
      ).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
      expect(spy5.called).toBe(false);
      expect(spy6.called).toBe(true);
    });

    it('already thrown superposition case', async () => {
      expect.assertions(6);
      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();

      const superposition1: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error1);
        },
        [MockRuntimeError]
      );
      const superposition2: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error2);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();
      const spy5: SinonSpy = sinon.spy();
      const spy6: SinonSpy = sinon.spy();

      await superposition1.transform<number>(
        () => {
          spy1();

          return superposition2;
        },
        () => {
          spy2();

          return superposition2;
        },
        MockRuntimeError
      ).transform<number>(
        () => {
          spy3();

          return superposition2;
        },
        () => {
          spy4();

          return superposition2;
        },
        MockRuntimeError
      ).transform<number>(
        () => {
          spy5();

          return superposition2;
        },
        () => {
          spy6();

          return superposition2;
        },
        MockRuntimeError
      ).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
      expect(spy5.called).toBe(false);
      expect(spy6.called).toBe(false);
    });
  });

  describe('pass', () => {
    it('accept case', () => {
      expect.assertions(4);
      const value: number = 2;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      superposition.pass(
        (v: number) => {
          spy1();
          expect(v).toBe(value);
        },
        () => {
          spy2();
        },
        () => {
          spy3();
        }
      );

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });

    it('decline case', () => {
      expect.assertions(4);
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      superposition.pass(
        () => {
          spy1();
        },
        (e: MockRuntimeError) => {
          spy2();
          expect(e).toBe(error);
        },
        () => {
          spy3();
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('throw case', () => {
      expect.assertions(4);
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        },
        [MockRuntimeError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      superposition.pass(
        () => {
          spy1();
        },
        () => {
          spy2();
        },
        (e: unknown) => {
          spy3();
          expect(e).toBe(error);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });

  describe('peek', () => {
    it('accept case', () => {
      expect.assertions(1);
      const value: number = 2;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );

      const spy: SinonSpy = sinon.spy();

      superposition.peek(() => {
        spy();
      });

      expect(spy.called).toBe(true);
    });

    it('decline case', () => {
      expect.assertions(1);
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      const spy: SinonSpy = sinon.spy();

      superposition.peek(() => {
        spy();
      });

      expect(spy.called).toBe(true);
    });

    it('throw case', () => {
      expect.assertions(1);
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        },
        [MockRuntimeError]
      );

      const spy: SinonSpy = sinon.spy();

      superposition.peek(() => {
        spy();
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('toUnscharferelation', () => {
    it('alive: will transform to present', async () => {
      expect.assertions(2);
      const value: number = 2;

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );

      const heisenberg: Heisenberg<number> = await superposition.toUnscharferelation().terminate();

      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('alive: if the value is undefined, will transform to absent', async () => {
      expect.assertions(2);
      const value: undefined = undefined;

      const superposition: SuperpositionInternal<undefined, MockRuntimeError> = SuperpositionInternal.of<undefined, MockRuntimeError>(
        (chrono: Chrono<undefined, MockRuntimeError>) => {
          chrono.accept(value);
        },
        [MockRuntimeError]
      );

      const heisenberg: Heisenberg<undefined> = await superposition.toUnscharferelation().terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('dead: will transform to absent', async () => {
      expect.assertions(2);
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.decline(error);
        },
        [MockRuntimeError]
      );

      const heisenberg: Heisenberg<number> = await superposition.toUnscharferelation().terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('contradiction: will transform to lost', async () => {
      expect.assertions(2);
      const error: MockRuntimeError = new MockRuntimeError();

      const superposition: SuperpositionInternal<number, MockRuntimeError> = SuperpositionInternal.of<number, MockRuntimeError>(
        (chrono: Chrono<number, MockRuntimeError>) => {
          chrono.throw(error);
        },
        [MockRuntimeError]
      );

      const heisenberg: Heisenberg<number> = await superposition.toUnscharferelation().terminate();

      expect(heisenberg.isLost()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(error);
    });
  });
});
