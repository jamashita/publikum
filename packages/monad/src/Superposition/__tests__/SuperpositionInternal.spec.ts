import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';

import { Epoque } from '../../Epoque/Interface/Epoque';
import { UnscharferelationError } from '../../Unscharferelation/Error/UnscharferelationError';
import { Heisenberg } from '../../Unscharferelation/Heisenberg/Heisenberg';
import { SuperpositionError } from '../Error/SuperpositionError';
import { Schrodinger } from '../Schrodinger/Schrodinger';
import { SuperpositionInternal } from '../SuperpositionInternal';

describe('SuperpositionInternal', () => {
  describe('resolve', () => {
    it('if done once, do nothing', async () => {
      const error: MockError = new MockError();

      const superposition: SuperpositionInternal<void, MockError> = SuperpositionInternal.of<void, MockError>(
        (epoque: Epoque<void, MockError>) => {
          epoque.resolve();
        }
      );

      const schrodinger1: Schrodinger<void, MockError> = await superposition.terminate();

      expect(schrodinger1.isAlive()).toBe(true);

      superposition.reject(error);

      const schrodinger2: Schrodinger<void, MockError> = await superposition.terminate();

      expect(schrodinger2.isAlive()).toBe(true);
    });

    it('call multiple maps', async () => {
      const value: number = -1.3;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.resolve(value);
        }
      );

      await superposition
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return v + 4;
        })
        .terminate();

      await superposition
        .map<number>((v: number) => {
          spy2();
          expect(v).toBe(value);

          return v + 3;
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });
  });

  describe('reject', () => {
    it('if done once, do nothing', async () => {
      const error: MockError = new MockError();
      const value: number = -1.3;

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.reject(error);
        }
      );

      const schrodinger1: Schrodinger<number, MockError> = await superposition.terminate();

      expect(schrodinger1.isDead()).toBe(true);

      superposition.resolve(value);

      const schrodinger2: Schrodinger<number, MockError> = await superposition.terminate();

      expect(schrodinger2.isDead()).toBe(true);
    });

    it('call multiple maps', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.reject(error);
        }
      );

      await superposition
        .recover<number, MockError>(() => {
          spy1();

          return 4;
        })
        .terminate();

      await superposition
        .recover<number, MockError>(() => {
          spy2();

          return 3;
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });
  });

  describe('get', () => {
    it('returns inner value', async () => {
      const value: number = -149;
      const error: MockError = new MockError();

      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.resolve(value);
        }
      );
      const superposition2: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.reject(error);
        }
      );

      await expect(superposition1.get()).resolves.toEqual(value);
      await expect(superposition2.get()).rejects.toThrow(MockError);
    });
  });

  describe('terminate', () => {
    it('returns Schrodinger subclass isntance', async () => {
      const value: number = -149;
      const error: MockError = new MockError();

      const alive: Schrodinger<number, MockError> = await SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.resolve(value);
        }
      ).terminate();
      const dead: Schrodinger<number, MockError> = await SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.reject(error);
        }
      ).terminate();

      expect(alive.isAlive()).toBe(true);
      expect(alive.get()).toBe(value);
      expect(dead.isDead()).toBe(true);
      expect(() => {
        dead.get();
      }).toThrow(MockError);
    });
  });

  describe('filter', () => {
    it('alive: predicate returns true', async () => {
      const value: number = -149;

      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.resolve(value);
        }
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
      const value: number = -149;

      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.resolve(value);
        }
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

    it('dead: returns itself inspite of the return value of filter', async () => {
      const error: MockError = new MockError();

      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.reject(error);
        }
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
  });

  describe('map', () => {
    it('sync case', async () => {
      const value: number = 2;
      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.resolve(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return v + 1;
        })
        .recover<number, MockError>(() => {
          spy2();

          return 100;
        })
        .map<void, MockError>((v: number) => {
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
      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.resolve(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return Promise.resolve<number>(v + 1);
        })
        .recover<number, MockError>(() => {
          spy2();

          return 100;
        })
        .map<void, MockError>((v: number) => {
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

      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.resolve(value1);
        }
      );
      const superposition2: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.resolve(value2);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition1
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value1);

          return superposition2;
        })
        .recover<number, MockError>(() => {
          spy2();

          return 100;
        })
        .map<void, MockError>((v: number) => {
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
      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.resolve(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          throw new MockError();
        })
        .recover<number, MockError>((err: MockError) => {
          spy2();
          expect(err).toBeInstanceOf(MockError);

          return 100;
        })
        .map<void, MockError>((v: number) => {
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
      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.resolve(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return Promise.reject<number>(new MockError());
        })
        .recover<number, MockError>((err: MockError) => {
          spy2();
          expect(err).toBeInstanceOf(MockError);

          return 100;
        })
        .map<void, MockError>((v: number) => {
          spy3();
          expect(v).toBe(100);
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('superposition case: returns Dead SuperpositionInternal', async () => {
      const value: number = 2;
      const error: MockError = new MockError();
      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.resolve(value);
        }
      );
      const superposition2: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.reject(error);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition1
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return superposition2;
        })
        .recover<number, MockError>((err: MockError) => {
          spy2();
          expect(err).toBe(error);

          return 100;
        })
        .map<void, MockError>((v: number) => {
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
      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.resolve(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return superposition;
        })
        .recover<number, MockError>(() => {
          spy2();

          return 100;
        })
        .map<void, MockError>((v: number) => {
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
      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.reject(error);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition
        .map<number>(() => {
          spy1();

          return 10;
        })
        .recover<number, MockError>((err: MockError) => {
          spy2();
          expect(err).toBe(error);

          return 100;
        })
        .map<void, MockError>((v: number) => {
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
      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.reject(error);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition
        .map<number>(() => {
          spy1();

          return 10;
        })
        .recover<number, MockError>((err: MockError) => {
          spy2();
          expect(err).toBe(error);

          return Promise.resolve<number>(100);
        })
        .map<void, MockError>((v: number) => {
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
      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.reject(error);
        }
      );
      const superposition2: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.resolve(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition1
        .map<number>(() => {
          spy1();

          return superposition2;
        })
        .recover<number, MockError>((err: MockError) => {
          spy2();
          expect(err).toBe(error);

          return superposition2;
        })
        .map<void, MockError>((v: number) => {
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
      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.reject(error);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition
        .recover<number, MockError>((err: MockError) => {
          spy1();
          expect(err).toBe(error);

          throw new MockError();
        })
        .recover<number, MockError>((err: MockError) => {
          spy2();
          expect(err).toBeInstanceOf(MockError);
          expect(err).not.toBe(error);

          return 100;
        })
        .map<void, MockError>((v: number) => {
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
      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.reject(error);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition
        .recover<number, MockError>((err: MockError) => {
          spy1();
          expect(err).toBe(error);

          return Promise.reject<number>(new MockError());
        })
        .recover<number, MockError>((err: MockError) => {
          spy2();
          expect(err).toBeInstanceOf(MockError);
          expect(err).not.toBe(error);

          return 100;
        })
        .map<void, MockError>((v: number) => {
          spy3();
          expect(v).toBe(100);
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('superposition case: returns Dead SuperpositionInternal', async () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.reject(error1);
        }
      );
      const superposition2: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.reject(error2);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition1
        .recover<number, MockError>((err: MockError) => {
          spy1();
          expect(err).toBe(error1);

          return superposition2;
        })
        .recover<number, MockError>((err: MockError) => {
          spy2();
          expect(err).toBe(error2);

          return 100;
        })
        .map<void, MockError>((v: number) => {
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
      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.reject(error);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition
        .recover<number, MockError>((err: MockError) => {
          spy1();
          expect(err).toBe(error);

          return superposition;
        })
        .map<number>(() => {
          spy2();

          return 10;
        })
        .recover<void, MockError>((err: MockError) => {
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
      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.resolve(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition
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
        .map<void, MockError>((v: number) => {
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
      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.resolve(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition
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
        .map<void, MockError>((v: number) => {
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
      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.resolve(value1);
        }
      );
      const superposition2: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.resolve(value2);
        }
      );
      const superposition3: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.resolve(value3);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition1
        .transform<number>(
          () => {
            spy1();

            return superposition2;
          },
          () => {
            spy2();

            return superposition3;
          }
        )
        .map<void, MockError>((v: number) => {
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
      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.reject(error1);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition
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
        .recover<void, MockError>((err: MockError) => {
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
      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.reject(error1);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition
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
        .recover<void, MockError>((err: MockError) => {
          spy3();
          expect(err).toBe(error3);
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('superposition case: returns Dead SuperpositionInternal', async () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();
      const error3: MockError = new MockError();
      const superposition1: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.reject(error1);
        }
      );
      const superposition2: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.reject(error2);
        }
      );
      const superposition3: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.reject(error3);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition1
        .transform<number>(
          () => {
            spy1();

            return superposition2;
          },
          () => {
            spy2();

            return superposition3;
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
      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.resolve(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition
        .transform<number>(
          () => {
            spy1();

            return superposition;
          },
          () => {
            spy2();

            return superposition;
          }
        )
        .map<void, MockError>((v: number) => {
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
      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.reject(error);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await superposition
        .transform<number>(
          () => {
            spy1();

            return superposition;
          },
          () => {
            spy2();

            return superposition;
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
      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.resolve(value);
        }
      );

      const heisenberg: Heisenberg<number> = await superposition.toUnscharferelation().terminate();

      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('dead: will transform to absent', async () => {
      const error: MockError = new MockError();
      const superposition: SuperpositionInternal<number, MockError> = SuperpositionInternal.of<number, MockError>(
        (epoque: Epoque<number, MockError>) => {
          epoque.reject(error);
        }
      );

      const heisenberg: Heisenberg<number> = await superposition.toUnscharferelation().terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });
  });
});
