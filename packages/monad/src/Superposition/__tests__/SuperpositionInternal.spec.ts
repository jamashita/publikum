import { MockError } from '@jamashita/publikum-object';
import sinon, { SinonSpy } from 'sinon';
import { UnscharferelationError } from '../../Unscharferelation/Error/UnscharferelationError';
import { Heisenberg } from '../../Unscharferelation/Heisenberg/Heisenberg';
import { Chrono } from '../Chrono/Interface/Chrono';
import { SuperpositionError } from '../Error/SuperpositionError';
import { Schrodinger } from '../Schrodinger/Schrodinger';
import { SuperpositionInternal } from '../SuperpositionInternal';

describe('SuperpositionInternal', () => {
  describe('accept', () => {
    it('if done once, do nothing', async () => {
      expect.assertions(2);
      const error: MockError = new MockError();

      const superposition: SuperpositionInternal<void, MockError> = SuperpositionInternal.of<void, MockError>(
        (chrono: Chrono<void, MockError>) => {
          chrono.accept();
        },
        [MockError]
      );

      const schrodinger1: Schrodinger<void, MockError> = await superposition.terminate();

      expect(schrodinger1.isAlive()).toBe(true);

      superposition.decline(error);

      const schrodinger2: Schrodinger<void, MockError> = await superposition.terminate();

      expect(schrodinger2.isAlive()).toBe(true);
    });

    it('call multiple maps', async () => {
      expect.assertions(2);
      const value: number = -1.3;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value);
        },
        [MockError]
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
      const error: MockError = new MockError();
      const value: number = -1.3;

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.decline(error);
        },
        [MockError]
      );

      const schrodinger1: Schrodinger<number, MockError> = await superposition.terminate();

      expect(schrodinger1.isDead()).toBe(true);

      superposition.accept(value);

      const schrodinger2: Schrodinger<number, MockError> = await superposition.terminate();

      expect(schrodinger2.isDead()).toBe(true);
    });

    it('call multiple maps', async () => {
      expect.assertions(2);
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.decline(error);
        },
        [MockError]
      );

      await superposition.recover<number, MockError>(() => {
        spy1();

        return 4;
      }).terminate();

      await superposition.recover<number, MockError>(() => {
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
      const error: MockError = new MockError();

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.throw(error);
        },
        [MockError]
      );

      const schrodinger1: Schrodinger<number, MockError> = await superposition.terminate();

      expect(schrodinger1.isContradiction()).toBe(true);

      superposition.accept(value);

      const schrodinger2: Schrodinger<number, MockError> = await superposition.terminate();

      expect(schrodinger2.isContradiction()).toBe(true);
    });

    it('call multiple maps', async () => {
      expect.assertions(4);
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.throw(error);
        },
        [MockError]
      );

      await superposition.map<number, MockError>(() => {
        spy1();

        return 4;
      }).terminate();

      await superposition.recover<number, MockError>(() => {
        spy2();

        return 3;
      }).terminate();

      await superposition.map<number, MockError>(() => {
        spy3();

        return 2;
      }).terminate();

      await superposition.recover<number, MockError>(() => {
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
      const error: MockError = new MockError();

      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value);
        },
        [MockError]
      );
      const superposition2: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.decline(error);
        },
        [MockError]
      );
      const superposition3: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.throw(error);
        },
        [MockError]
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
      const error: MockError = new MockError();

      const alive: Schrodinger<number, MockError> = await SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value);
        },
        [MockError]
      ).terminate();
      const dead: Schrodinger<number, MockError> = await SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.decline(error);
        },
        [MockError]
      ).terminate();
      const contradiction: Schrodinger<number, MockError> = await SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.throw(error);
        },
        [MockError]
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

      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value);
        },
        [MockError]
      );
      const superposition2: SuperpositionInternal<number, MockError | SuperpositionError> = superposition1.filter(
        () => {
          return true;
        }
      );

      const shcrodiner: Schrodinger<number, MockError | SuperpositionError> = await superposition2.terminate();

      expect(shcrodiner.isAlive()).toBe(true);
      expect(shcrodiner.get()).toBe(value);
    });

    it('alive: predicate returns false', async () => {
      expect.assertions(2);
      const value: number = -149;

      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value);
        },
        [MockError]
      );
      const superposition2: SuperpositionInternal<number, MockError | SuperpositionError> = superposition1.filter(
        () => {
          return false;
        }
      );

      const shcrodiner: Schrodinger<number, MockError | SuperpositionError> = await superposition2.terminate();

      expect(shcrodiner.isDead()).toBe(true);
      expect(() => {
        shcrodiner.get();
      }).toThrow(SuperpositionError);
    });

    it('dead: returns its copy inspite of the return value of filter', async () => {
      expect.assertions(4);
      const error: MockError = new MockError();

      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.decline(error);
        },
        [MockError]
      );
      const superposition2: SuperpositionInternal<number, MockError | SuperpositionError> = superposition1.filter(
        () => {
          return true;
        }
      );
      const superposition3: SuperpositionInternal<number, MockError | SuperpositionError> = superposition1.filter(
        () => {
          return false;
        }
      );

      const shcrodiner1: Schrodinger<number, MockError | SuperpositionError> = await superposition2.terminate();
      const shcrodiner2: Schrodinger<number, MockError | SuperpositionError> = await superposition3.terminate();

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
      const error: MockError = new MockError();

      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.throw(error);
        },
        [MockError]
      );
      const superposition2: SuperpositionInternal<number, MockError | SuperpositionError> = superposition1.filter(
        () => {
          return true;
        }
      );
      const superposition3: SuperpositionInternal<number, MockError | SuperpositionError> = superposition1.filter(
        () => {
          return false;
        }
      );

      const shcrodiner1: Schrodinger<number, MockError | SuperpositionError> = await superposition2.terminate();
      const shcrodiner2: Schrodinger<number, MockError | SuperpositionError> = await superposition3.terminate();

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
      expect.assertions(3);
      const value: number = 2;

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return v + 1;
      }, MockError).map<number, MockError>((v: number) => {
        spy2();
        expect(v).toBe(value + 1);

        return v + 1;
      }, MockError).map<number, MockError>((v: number) => {
        spy3();
        expect(v).toBe(value + 2);

        return v + 1;
      }, MockError).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('async case', async () => {
      expect.assertions(3);
      const value: number = 2;

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.resolve<number>(v + 1);
      }, MockError).map<number, MockError>((v: number) => {
        spy2();
        expect(v).toBe(value + 1);

        return Promise.resolve<number>(v + 2);
      }, MockError).map<number, MockError>((v: number) => {
        spy3();
        expect(v).toBe(value + 2);

        return Promise.resolve<number>(v + 1);
      }, MockError).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('alive Superposition case', async () => {
      expect.assertions(3);
      const value1: number = 2;
      const value2: number = 200;
      const value3: number = 20000;

      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value1);
        },
        [MockError]
      );
      const superposition2: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value2);
        },
        [MockError]
      );
      const superposition3: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value3);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value1);

        return superposition2;
      }, MockError).map<number, MockError>(() => {
        spy2();

        return superposition3;
      }, MockError).map<number, MockError>((v: number) => {
        spy3();
        expect(v).toBe(value3);

        return superposition3;
      }, MockError).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('sync case: throws error', async () => {
      expect.assertions(3);
      const value: number = 2;
      const error: MockError = new MockError();

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        throw error;
      }, MockError).map<number, MockError>(() => {
        spy2();

        throw error;
      }, MockError).map<number, MockError>(() => {
        spy3();

        throw error;
      }, MockError).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });

    it('async case: returns Promise rejection', async () => {
      expect.assertions(3);
      const value: number = 2;
      const error: MockError = new MockError();

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.reject<number>(error);
      }, MockError).map<number, MockError>(() => {
        spy2();

        return Promise.reject<number>(error);
      }, MockError).map<number, MockError>(() => {
        spy3();

        return Promise.reject<number>(error);
      }, MockError).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });

    it('dead Superposition case', async () => {
      expect.assertions(3);
      const value: number = 2;
      const error: MockError = new MockError();

      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value);
        },
        [MockError]
      );
      const superposition2: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.decline(error);
        },
        [MockError]
      );
      const superposition3: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.decline(error);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return superposition2;
      }, MockError).map<number, MockError>(() => {
        spy2();

        return superposition3;
      }, MockError).map<number, MockError>(() => {
        spy3();

        return superposition3;
      }, MockError).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });

    it('sync case: throws unexpected error', async () => {
      expect.assertions(4);
      const value: number = 2;
      const error: MockError = new MockError();

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await superposition.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        throw error;
      }).map<number, MockError>(() => {
        spy2();

        throw error;
      }).map<number, MockError>(() => {
        spy3();

        throw error;
      }).recover<number, MockError>(() => {
        spy4();

        throw error;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('async case: returns unexpected Promise reject', async () => {
      expect.assertions(4);
      const value: number = 2;
      const error: MockError = new MockError();

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await superposition.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.reject<number>(error);
      }).map<number, MockError>(() => {
        spy2();

        return Promise.reject<number>(error);
      }).map<number, MockError>(() => {
        spy3();

        return Promise.reject<number>(error);
      }).recover<number, MockError>(() => {
        spy4();

        return Promise.reject<number>(error);
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('contradiction Superposition case', async () => {
      expect.assertions(4);
      const value: number = 2;
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const error3: MockError = new MockError();

      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value);
        },
        [MockError]
      );
      const superposition2: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.throw(error1);
        },
        [MockError]
      );
      const superposition3: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.throw(error2);
        },
        [MockError]
      );
      const superposition4: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.throw(error3);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await superposition1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return superposition2;
      }, MockError).map<number, MockError>(() => {
        spy2();

        return superposition3;
      }, MockError).map<number, MockError>(() => {
        spy3();

        return superposition4;
      }, MockError).recover<number, MockError>(() => {
        spy4();

        return superposition4;
      }, MockError).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('already accepted Superposition case', async () => {
      expect.assertions(3);
      const value1: number = 2;
      const value2: number = 20;

      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value1);
        },
        [MockError]
      );
      const superposition2: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value2);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition1.map<number, MockError>((v: number) => {
        spy1();
        expect(v).toBe(value1);

        return superposition2;
      }, MockError).map<number, MockError>((v: number) => {
        spy2();
        expect(v).toBe(value2);

        return superposition2;
      }, MockError).map<number, MockError>((v: number) => {
        spy3();
        expect(v).toBe(value2);

        return superposition2;
      }, MockError).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('already declined Superposition case', async () => {
      expect.assertions(3);
      const value1: number = 2;
      const error: MockError = new MockError();

      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value1);
        },
        [MockError]
      );
      const superposition2: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.decline(error);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition1.map<number, MockError>((v: number) => {
        spy1();
        expect(v).toBe(value1);

        return superposition2;
      }, MockError).recover<number, MockError>(() => {
        spy2();

        return superposition2;
      }, MockError).recover<number, MockError>(() => {
        spy3();

        return superposition2;
      }, MockError).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('already thrown Superposition case', async () => {
      expect.assertions(3);
      const value1: number = 2;
      const error: MockError = new MockError();

      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value1);
        },
        [MockError]
      );
      const superposition2: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.throw(error);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition1.map<number, MockError>((v: number) => {
        spy1();
        expect(v).toBe(value1);

        return superposition2;
      }, MockError).recover<number, MockError>(() => {
        spy2();

        return superposition2;
      }, MockError).map<number, MockError>((v: number) => {
        spy3();
        expect(v).toBe(value1);

        return superposition2;
      }, MockError).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });
  });

  describe('recover', () => {
    it('sync case', async () => {
      expect.assertions(3);
      const value: number = -201;
      const error: MockError = new MockError();

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.decline(error);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition.map<number, MockError>((v: number) => {
        spy1();

        return v + 1;
      }, MockError).recover<number, MockError>((err: MockError) => {
        spy2();
        expect(err).toBe(error);

        return value + 13;
      }, MockError).map<number, MockError>((v: number) => {
        spy3();
        expect(v).toBe(value + 13);

        return value + 130;
      }, MockError).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('async case', async () => {
      expect.assertions(3);
      const value: number = -201;
      const error: MockError = new MockError();

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.decline(error);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition.map<number, MockError>((v: number) => {
        spy1();

        return Promise.resolve<number>(v + 1);
      }, MockError).recover<number, MockError>((err: MockError) => {
        spy2();
        expect(err).toBe(error);

        return Promise.resolve<number>(value + 13);
      }, MockError).map<number, MockError>((v: number) => {
        spy3();
        expect(v).toBe(v + 13);

        return Promise.resolve<number>(v + 130);
      }, MockError).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('alive Superposition case', async () => {
      expect.assertions(3);
      const value1: number = 2;
      const value2: number = 20;
      const error: MockError = new MockError();

      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.decline(error);
        },
        [MockError]
      );
      const superposition2: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value1);
        },
        [MockError]
      );
      const superposition3: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value2);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition1.map<number, MockError>(() => {
        spy1();

        return superposition2;
      }, MockError).recover<number, MockError>((err: MockError) => {
        spy2();
        expect(err).toBe(error);

        return superposition3;
      }, MockError).map<number, MockError>((v: number) => {
        spy3();
        expect(v).toBe(value2);

        return superposition3;
      }, MockError).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('sync case: throws error', async () => {
      expect.assertions(3);
      const value: number = 2;
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.decline(error1);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition.recover<number, MockError>((err: MockError) => {
        spy1();
        expect(err).toBe(error1);

        throw error2;
      }, MockError).recover<number, MockError>((err: MockError) => {
        spy2();
        expect(err).toBe(error2);

        return value + 13;
      }, MockError).map<number, MockError>((v: number) => {
        spy3();
        expect(v).toBe(value + 13);

        return value + 130;
      }, MockError).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('async case: returns Promise rejection', async () => {
      expect.assertions(3);
      const value: number = 2;
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.decline(error1);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition.recover<number, MockError>((err: MockError) => {
        spy1();
        expect(err).toBe(error1);

        return Promise.reject<number>(error2);
      }, MockError).recover<number, MockError>((err: MockError) => {
        spy2();
        expect(err).toBe(error2);

        return value + 13;
      }, MockError).map<number, MockError>((v: number) => {
        spy3();
        expect(v).toBe(value + 13);

        return value + 130;
      }, MockError).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('dead Superposition case', async () => {
      expect.assertions(3);
      const value: number = 2;
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();

      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value);
        },
        [MockError]
      );
      const superposition2: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.decline(error1);
        },
        [MockError]
      );
      const superposition3: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.decline(error2);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition1.map<number, MockError>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return superposition2;
      }, MockError).recover<number, MockError>((err: MockError) => {
        spy2();
        expect(err).toBe(error1);

        return superposition3;
      }, MockError).map<number, MockError>((v: number) => {
        spy3();
        expect(v).toBe(v + 13);

        return superposition3;
      }, MockError).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('sync case: throws unexpected error', async () => {
      expect.assertions(4);
      const value: number = 2;
      const error: MockError = new MockError();

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await superposition.map<number, MockError>((v: number) => {
        spy1();
        expect(v).toBe(value);

        throw error;
      }).recover<number, MockError>(() => {
        spy2();

        return value + 13;
      }, MockError).map<number, MockError>(() => {
        spy3();

        return value + 130;
      }, MockError).recover<number, MockError>(() => {
        spy4();

        return value + 13;
      }, MockError).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('async case: returns unexpected Promise rejection', async () => {
      expect.assertions(4);
      const value: number = 2;
      const error: MockError = new MockError();

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await superposition.map<number, MockError>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.reject<number>(error);
      }).recover<number, MockError>(() => {
        spy2();

        return Promise.reject<number>(error);
      }, MockError).map<number, MockError>(() => {
        spy3();

        return Promise.reject<number>(error);
      }, MockError).recover<number, MockError>(() => {
        spy4();

        return Promise.reject<number>(error);
      }, MockError).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('contradiction Superposition case', async () => {
      expect.assertions(4);
      const value: number = 2;
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const error3: MockError = new MockError();

      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value);
        },
        [MockError]
      );
      const superposition2: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.throw(error1);
        },
        [MockError]
      );
      const superposition3: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.throw(error2);
        },
        [MockError]
      );
      const superposition4: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.throw(error3);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await superposition1.map<number, MockError>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return superposition2;
      }, MockError).recover<number, MockError>(() => {
        spy2();

        return superposition3;
      }, MockError).map<number, MockError>(() => {
        spy3();

        return superposition4;
      }, MockError).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('already accepted superposition case', async () => {
      expect.assertions(3);
      const value1: number = 2;
      const value2: number = 2;

      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value1);
        },
        [MockError]
      );
      const superposition2: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value1);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition1.map<number, MockError>((v: number) => {
        spy1();
        expect(v).toBe(value1);

        return superposition2;
      }, MockError).map<number>((v: number) => {
        spy2();
        expect(v).toBe(value2);

        return superposition2;
      }, MockError).map<number, MockError>((v: number) => {
        spy3();
        expect(v).toBe(value2);

        return superposition2;
      }, MockError).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('already declined superposition case', async () => {
      expect.assertions(3);
      const value: number = 2;
      const error: MockError = new MockError();

      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value);
        },
        [MockError]
      );
      const superposition2: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.decline(error);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition1.map<number, MockError>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return superposition2;
      }, MockError).recover<number, MockError>((err: MockError) => {
        spy2();
        expect(err).toBe(error);

        return superposition2;
      }, MockError).recover<number, MockError>((err: MockError) => {
        spy3();
        expect(err).toBe(error);

        return superposition2;
      }, MockError).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });
  });

  describe('transform', () => {
    it('alive: sync case', async () => {
      expect.assertions(4);
      const value1: number = 2;
      const value2: number = 20;
      const value3: number = 200;

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value1);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await superposition.transform<number, MockError>(
        (v: number) => {
          spy1();
          expect(v).toBe(value1);

          return value2;
        },
        () => {
          spy2();

          return value3;
        },
        MockError
      ).transform<number, MockError>(
        (v: number) => {
          spy3();
          expect(v).toBe(value2);

          return value2;
        },
        () => {
          spy4();

          return value3;
        },
        MockError
      ).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('alive: async case', async () => {
      expect.assertions(4);
      const value1: number = 2;
      const value2: number = 20;
      const value3: number = 200;

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value1);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await superposition.transform<number, MockError>(
        (v: number) => {
          spy1();
          expect(v).toBe(value1);

          return Promise.resolve<number>(value2);
        },
        () => {
          spy2();

          return Promise.resolve<number>(value3);
        },
        MockError
      ).transform<number, MockError>(
        (v: number) => {
          spy3();
          expect(v).toBe(value2);

          return Promise.resolve<number>(value2);
        },
        () => {
          spy4();

          return Promise.resolve<number>(value3);
        },
        MockError
      ).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('alive Superposition case', async () => {
      expect.assertions(4);
      const value1: number = 2;
      const value2: number = 20;
      const value3: number = 200;

      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value1);
        },
        [MockError]
      );
      const superposition2: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value2);
        },
        [MockError]
      );
      const superposition3: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value3);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await superposition1.transform<number, MockError>(
        (v: number) => {
          spy1();
          expect(v).toBe(value1);

          return superposition2;
        },
        () => {
          spy2();

          return superposition3;
        },
        MockError
      ).transform<number, MockError>(
        (v: number) => {
          spy3();
          expect(v).toBe(value2);

          return superposition2;
        },
        () => {
          spy4();

          return superposition3;
        },
        MockError
      ).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('dead: sync case: throws error', async () => {
      expect.assertions(4);
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const error3: MockError = new MockError();

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.decline(error1);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await superposition.transform<number, MockError>(
        () => {
          spy1();

          throw error2;
        },
        (err: MockError) => {
          spy2();
          expect(err).toBe(error1);

          throw error3;
        }
      ).transform<number, MockError>(
        () => {
          spy3();

          throw error2;
        },
        (err: MockError) => {
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
      expect.assertions(4);
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const error3: MockError = new MockError();

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.decline(error1);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await superposition.transform<number, MockError>(
        () => {
          spy1();

          return Promise.reject<number>(error2);
        },
        (err: MockError) => {
          spy2();
          expect(err).toBe(error1);

          return Promise.reject<number>(error3);
        },
        MockError
      ).transform<number, MockError>(
        () => {
          spy3();

          return Promise.reject<number>(error2);
        },
        (err: MockError) => {
          spy4();
          expect(err).toBe(error1);

          return Promise.reject<number>(error3);
        },
        MockError
      ).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('dead Superposition case', async () => {
      expect.assertions(4);
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const error3: MockError = new MockError();

      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.decline(error1);
        },
        [MockError]
      );
      const superposition2: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.decline(error2);
        },
        [MockError]
      );
      const superposition3: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.decline(error3);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await superposition1.transform<number, MockError>(
        () => {
          spy1();

          return superposition2;
        },
        (err: MockError) => {
          spy2();
          expect(err).toBe(error1);

          return superposition3;
        },
        MockError
      ).transform<number, MockError>(
        () => {
          spy3();

          return superposition2;
        },
        (err: MockError) => {
          spy4();
          expect(err).toBe(error1);

          return superposition3;
        },
        MockError
      ).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('already accepted superposition case', async () => {
      expect.assertions(6);
      const value1: number = 2;
      const value2: number = 2;

      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value1);
        },
        [MockError]
      );
      const superposition2: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value2);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();
      const spy5: SinonSpy = sinon.spy();
      const spy6: SinonSpy = sinon.spy();

      await superposition1.transform<number, MockError>(
        (v: number) => {
          spy1();
          expect(v).toBe(value1);

          return superposition2;
        },
        () => {
          spy2();

          return superposition2;
        },
        MockError
      ).transform<number, MockError>(
        (v: number) => {
          spy3();
          expect(v).toBe(value2);

          return superposition2;
        },
        () => {
          spy4();

          return superposition2;
        },
        MockError
      ).transform<number, MockError>(
        (v: number) => {
          spy5();
          expect(v).toBe(value2);

          return superposition2;
        },
        () => {
          spy6();

          return superposition2;
        },
        MockError
      ).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
      expect(spy5.called).toBe(true);
      expect(spy6.called).toBe(false);
    });

    it('already declined superposition case', async () => {
      expect.assertions(6);
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();

      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.decline(error1);
        },
        [MockError]
      );
      const superposition2: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.decline(error2);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();
      const spy5: SinonSpy = sinon.spy();
      const spy6: SinonSpy = sinon.spy();

      await superposition1.transform<number, MockError>(
        () => {
          spy1();

          return superposition2;
        },
        (err: MockError) => {
          spy2();
          expect(err).toBe(error1);

          return superposition2;
        },
        MockError
      ).transform<number, MockError>(
        () => {
          spy3();

          return superposition2;
        },
        (err: MockError) => {
          spy4();
          expect(err).toBe(error2);

          return superposition2;
        },
        MockError
      ).transform<number, MockError>(
        () => {
          spy5();

          return superposition2;
        },
        (err: MockError) => {
          spy6();
          expect(err).toBe(error2);

          return superposition2;
        },
        MockError
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
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();

      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.throw(error1);
        },
        [MockError]
      );
      const superposition2: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.throw(error2);
        },
        [MockError]
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
        MockError
      ).transform<number>(
        () => {
          spy3();

          return superposition2;
        },
        () => {
          spy4();

          return superposition2;
        },
        MockError
      ).transform<number>(
        () => {
          spy5();

          return superposition2;
        },
        () => {
          spy6();

          return superposition2;
        },
        MockError
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
      expect.assertions(3);
      const value: number = 2;

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value);
        },
        [MockError]
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
      expect.assertions(3);
      const error: MockError = new MockError();

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.decline(error);
        },
        [MockError]
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      superposition.pass(
        () => {
          spy1();
        },
        (e: MockError) => {
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
      expect.assertions(3);
      const error: MockError = new MockError();

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.throw(error);
        },
        [MockError]
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

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value);
        },
        [MockError]
      );

      const spy: SinonSpy = sinon.spy();

      superposition.peek(() => {
        spy();
      });

      expect(spy.called).toBe(true);
    });

    it('decline case', () => {
      expect.assertions(1);
      const error: MockError = new MockError();

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.decline(error);
        },
        [MockError]
      );

      const spy: SinonSpy = sinon.spy();

      superposition.peek(() => {
        spy();
      });

      expect(spy.called).toBe(true);
    });

    it('throw case', () => {
      expect.assertions(1);
      const error: MockError = new MockError();

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.throw(error);
        },
        [MockError]
      );

      const spy: SinonSpy = sinon.spy();

      superposition.peek(() => {
        spy();
      });

      expect(spy.called).toBe(true);
    });
  });

  describe.skip('toUnscharferelation', () => {
    it('alive: will transform to present', async () => {
      expect.assertions(2);
      const value: number = 2;

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.accept(value);
        },
        [MockError]
      );

      const heisenberg: Heisenberg<number> = await superposition.toUnscharferelation().terminate();

      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('alive: if the value is undefined, will transform to absent', async () => {
      expect.assertions(2);
      const value: undefined = undefined;

      const superposition: SuperpositionInternal<undefined, MockError> = SuperpositionInternal.of<undefined, MockError>(
        (chrono: Chrono<undefined, MockError>) => {
          chrono.accept(value);
        },
        [MockError]
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

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.decline(error);
        },
        [MockError]
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

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (chrono: Chrono<number, MockError>) => {
          chrono.throw(error);
        },
        [MockError]
      );

      const heisenberg: Heisenberg<number> = await superposition.toUnscharferelation().terminate();

      expect(heisenberg.isLost()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(error);
    });
  });
});
