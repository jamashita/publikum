import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';

import { Epoque } from '../../Epoque/Interface/Epoque';
import { Schrodinger } from '../../Superposition/Schrodinger/Schrodinger';
import { UnscharferelationError } from '../Error/UnscharferelationError';
import { Heisenberg } from '../Heisenberg/Heisenberg';
import { Lost } from '../Heisenberg/Lost';
import { UnscharferelationInternal } from '../UnscharferelationInternal';

describe('UnscharferelationInternal', () => {
  describe('accept', () => {
    it('if done once, do nothing', async () => {
      const unscharferelation: UnscharferelationInternal<void> = UnscharferelationInternal.of<void>(
        (epoque: Epoque<void, void>) => {
          epoque.accept();
        }
      );

      const heisenberg1: Heisenberg<void> = await unscharferelation.terminate();

      expect(heisenberg1.isPresent()).toBe(true);

      unscharferelation.decline();

      const heisenberg2: Heisenberg<void> = await unscharferelation.terminate();

      expect(heisenberg2.isPresent()).toBe(true);
    });

    it('call multiple maps', async () => {
      const value: number = -1.3;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.accept(value);
        }
      );

      await unscharferelation
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return v + 4;
        })
        .terminate();

      await unscharferelation
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

  describe('decline', () => {
    it('if done once, do nothing', async () => {
      const value: number = -1.3;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.decline();
        }
      );

      const heisenberg1: Heisenberg<number> = await unscharferelation.terminate();

      expect(heisenberg1.isAbsent()).toBe(true);

      unscharferelation.accept(value);

      const heisenberg2: Heisenberg<number> = await unscharferelation.terminate();

      expect(heisenberg2.isAbsent()).toBe(true);
    });

    it('call multiple maps', async () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.decline();
        }
      );

      await unscharferelation
        .recover<number>(() => {
          spy1();

          return 4;
        })
        .terminate();

      await unscharferelation
        .recover<number>(() => {
          spy2();

          return 3;
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });
  });

  describe('throw', () => {
    it('if done once, do nothing', async () => {
      const value: number = -1.3;
      const error: MockError = new MockError();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.throw(error);
        }
      );

      const heisenberg1: Heisenberg<number> = await unscharferelation.terminate();

      expect(heisenberg1).toBeInstanceOf(Lost);

      unscharferelation.accept(value);

      const heisenberg2: Heisenberg<number> = await unscharferelation.terminate();

      expect(heisenberg2).toBeInstanceOf(Lost);
    });

    it('call multiple maps, but nothing will be invoked', async () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.decline();
        }
      );

      await unscharferelation
        .map<number>(() => {
          spy1();

          return 4;
        })
        .terminate();

      await unscharferelation
        .recover<number>(() => {
          spy3();

          return 3;
        })
        .terminate();

      await unscharferelation
        .map<number>(() => {
          spy3();

          return 2;
        })
        .terminate();

      await unscharferelation
        .recover<number>(() => {
          spy4();

          return 1;
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });
  });

  describe('get', () => {
    it('returns inner value', async () => {
      const value: number = -201;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.decline();
        }
      );

      await expect(unscharferelation1.get()).resolves.toBe(value);
      await expect(unscharferelation2.get()).rejects.toThrow(UnscharferelationError);
    });
  });

  describe('terminate', () => {
    it('returns Heisenberg subclass instance', async () => {
      const value: number = -201;

      const present: Heisenberg<number> = await UnscharferelationInternal.of<number>((epoque: Epoque<number, void>) => {
        epoque.accept(value);
      }).terminate();
      const absent: Heisenberg<number> = await UnscharferelationInternal.of<number>((epoque: Epoque<number, void>) => {
        epoque.decline();
      }).terminate();

      expect(present.isPresent()).toBe(true);
      expect(present.get()).toBe(value);
      expect(absent.isAbsent()).toBe(true);
      expect(() => {
        absent.get();
      }).toThrow(UnscharferelationError);
    });
  });

  describe('filter', () => {
    it('present: predicate returns true', async () => {
      const value: number = -201;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = unscharferelation1.filter(() => {
        return true;
      });

      const heisenberg: Heisenberg<number> = await unscharferelation2.terminate();

      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('present: predicate returns false', async () => {
      const value: number = -201;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = unscharferelation1.filter(() => {
        return false;
      });

      const heisenberg: Heisenberg<number> = await unscharferelation2.terminate();

      expect(heisenberg.isAbsent()).toBe(true);
      expect(() => {
        heisenberg.get();
      }).toThrow(UnscharferelationError);
    });

    it('absent: returns itself inspite of the return value of filter', async () => {
      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.decline();
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = unscharferelation1.filter(() => {
        return true;
      });
      const unscharferelation3: UnscharferelationInternal<number> = unscharferelation1.filter(() => {
        return false;
      });
      const heisenberg1: Heisenberg<number> = await unscharferelation2.terminate();
      const heisenberg2: Heisenberg<number> = await unscharferelation3.terminate();

      expect(unscharferelation1).toBe(unscharferelation2);
      expect(heisenberg1.isAbsent()).toBe(true);
      expect(() => {
        heisenberg1.get();
      }).toThrow(UnscharferelationError);
      expect(unscharferelation1).toBe(unscharferelation3);
      expect(heisenberg2.isAbsent()).toBe(true);
      expect(() => {
        heisenberg2.get();
      }).toThrow(UnscharferelationError);
    });
  });

  describe('map', () => {
    it('sync case', async () => {
      const value: number = -201;
      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.accept(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      await unscharferelation
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return v + 1;
        })
        .map<number>((v: number) => {
          spy2();
          expect(v).toBe(value + 1);

          return v + 1;
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });

    it('async case', async () => {
      const value: number = -201;
      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.accept(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      await unscharferelation
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return Promise.resolve<number>(v + 1);
        })
        .map<number>((v: number) => {
          spy2();
          expect(v).toBe(value + 1);

          return v + 1;
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });

    it('unscharferelation case', async () => {
      const value1: number = -201;
      const value2: number = -20100;
      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.accept(value1);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.accept(value2);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      await unscharferelation1
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value1);

          return unscharferelation2;
        })
        .map<number>((v: number) => {
          spy2();
          expect(v).toBe(value2);

          return v + 1;
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });

    it('sync case: returns null', async () => {
      const value: number = -201;
      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.accept(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      await unscharferelation
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return null;
        })
        .map<number>(() => {
          spy2();

          return null;
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });

    it('async case: returns acceptd null', async () => {
      const value: number = -201;
      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.accept(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      await unscharferelation
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return Promise.resolve<null>(null);
        })
        .map<number>(() => {
          spy2();

          return null;
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });

    it('unscharferelation case: returns Absent UnscharferelationInternal', async () => {
      const value: number = -201;
      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.decline();
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      await unscharferelation1
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return unscharferelation2;
        })
        .map<number>(() => {
          spy2();

          return null;
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });

    it('already acceptd unscharferelation case', async () => {
      const value: number = -201;
      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.accept(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      await unscharferelation
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return unscharferelation;
        })
        .map<number>((v: number) => {
          spy2();
          expect(v).toBe(value);

          return v + 230;
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });
  });

  describe('recover', () => {
    it('sync case', async () => {
      const value: number = -201;
      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.decline();
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation
        .map<number>((v: number) => {
          spy1();

          return v + 1;
        })
        .recover<number>(() => {
          spy2();

          return value + 23;
        })
        .map<number>((v: number) => {
          spy3();
          expect(v).toBe(value + 23);

          return v + 230;
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('async case', async () => {
      const value: number = -201;
      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.decline();
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation
        .map<number>((v: number) => {
          spy1();

          return v + 1;
        })
        .recover<number>(() => {
          spy2();

          return Promise.resolve<number>(value + 23);
        })
        .map<number>((v: number) => {
          spy3();
          expect(v).toBe(value + 23);

          return v + 340;
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('unscharferelation case', async () => {
      const value: number = -20100;
      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.decline();
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.accept(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1
        .map<number>(() => {
          spy1();

          return unscharferelation2;
        })
        .recover<number>(() => {
          spy2();

          return unscharferelation2;
        })
        .map<number>((v: number) => {
          spy3();
          expect(v).toBe(value);

          return v + 2;
        })
        .terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('sync case: returns null', async () => {
      const value: number = -201;
      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.accept(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return null;
        })
        .recover<number>(() => {
          spy2();

          return value + 23;
        })
        .map<number>((v: number) => {
          spy3();
          expect(v).toBe(value + 23);

          return v + 230;
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy2.called).toBe(true);
    });

    it('async case: returns acceptd null', async () => {
      const value: number = -201;
      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.accept(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return Promise.resolve<null>(null);
        })
        .recover<number>(() => {
          spy2();

          return value + 23;
        })
        .map<number>((v: number) => {
          spy3();
          expect(v).toBe(value + 23);

          return v + 230;
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('unscharferelation case: returns Absent UnscharferelationInternal', async () => {
      const value: number = -201;
      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.decline();
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return unscharferelation2;
        })
        .recover<number>(() => {
          spy2();

          return value + 23;
        })
        .map<number>((v: number) => {
          spy3();
          expect(v).toBe(value + 23);

          return value + 230;
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('already acceptd unscharferelation case', async () => {
      const value: number = -201;
      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.accept(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      await unscharferelation
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return unscharferelation;
        })
        .map<number>((v: number) => {
          spy2();
          expect(v).toBe(value);

          return v + 23;
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });
  });

  describe('toSuperposition', () => {
    it('present: will transform to alive', async () => {
      const value: number = -201;
      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.accept(value);
        }
      );

      const schrodinger: Schrodinger<
        number,
        UnscharferelationError
      > = await unscharferelation.toSuperposition().terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(value);
    });

    it('absent: will transform to dead', async () => {
      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number, void>) => {
          epoque.decline();
        }
      );

      const schrodinger: Schrodinger<
        number,
        UnscharferelationError
      > = await unscharferelation.toSuperposition().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(UnscharferelationError);
    });
  });
});
