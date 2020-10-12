import { MockRuntimeError } from '@jamashita/publikum-error';
import { MockValueObject } from '@jamashita/publikum-object';
import sinon, { SinonSpy } from 'sinon';
import { Schrodinger } from '../../Superposition/Schrodinger/Schrodinger';
import { Epoque } from '../Epoque/Interface/Epoque';
import { UnscharferelationError } from '../Error/UnscharferelationError';
import { Heisenberg } from '../Heisenberg/Heisenberg';
import { UnscharferelationInternal } from '../UnscharferelationInternal';

describe('UnscharferelationInternal', () => {
  describe('equals', () => {
    it('returns true if the same instance given', () => {
      expect.assertions(1);

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(-1);
        }
      );

      expect(unscharferelation.equals(unscharferelation)).toBe(true);
    });

    it('returns false if the different class instance given', () => {
      expect.assertions(1);

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(-1);
        }
      );

      expect(unscharferelation.equals(new MockValueObject('mock'))).toBe(false);
    });

    it('returns true if their retaining Heisenbergs are the same', () => {
      expect.assertions(4);

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(-1);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(-1);
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(0);
        }
      );
      const unscharferelation4: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );
      const unscharferelation5: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(null);
        }
      );

      expect(unscharferelation1.equals(unscharferelation2)).toBe(true);
      expect(unscharferelation1.equals(unscharferelation3)).toBe(false);
      expect(unscharferelation1.equals(unscharferelation4)).toBe(false);
      expect(unscharferelation1.equals(unscharferelation5)).toBe(false);
    });
  });

  describe('toString', () => {
    it('returns its retaining Heisenberg string', () => {
      expect.assertions(3);

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(-1);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(null);
        }
      );

      expect(unscharferelation1.toString()).toBe('Present: -1');
      expect(unscharferelation2.toString()).toBe('Absent');
      expect(unscharferelation3.toString()).toBe('Lost: null');
    });
  });

  describe('accept', () => {
    it('if done once, do nothing', async () => {
      expect.assertions(4);

      const value: number = -35;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const heisenberg1: Heisenberg<number> = await unscharferelation.terminate();

      expect(heisenberg1.isPresent()).toBe(true);
      expect(heisenberg1.get()).toBe(value);

      unscharferelation.decline();

      const heisenberg2: Heisenberg<number> = await unscharferelation.terminate();

      expect(heisenberg2.isPresent()).toBe(true);
      expect(heisenberg2.get()).toBe(value);
    });

    it('call multiple maps', async () => {
      expect.assertions(4);

      const value: number = -1.3;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      await unscharferelation.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return v + 4;
      }).terminate();

      await unscharferelation.map<number>((v: number) => {
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

      const value: number = -1.3;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
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
      expect.assertions(2);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      await unscharferelation.recover<number>(() => {
        spy1();

        return 4;
      }).terminate();

      await unscharferelation.recover<number>(() => {
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

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      const heisenberg1: Heisenberg<number> = await unscharferelation.terminate();

      expect(heisenberg1.isLost()).toBe(true);

      unscharferelation.accept(value);

      const heisenberg2: Heisenberg<number> = await unscharferelation.terminate();

      expect(heisenberg2.isLost()).toBe(true);
    });

    it('call multiple maps, but nothing will be invoked', async () => {
      expect.assertions(4);

      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      await unscharferelation.map<number>(() => {
        spy1();

        return 4;
      }).terminate();

      await unscharferelation.recover<number>(() => {
        spy2();

        return 3;
      }).terminate();

      await unscharferelation.map<number>(() => {
        spy3();

        return 2;
      }).terminate();

      await unscharferelation.recover<number>(() => {
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

      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      await expect(unscharferelation1.get()).resolves.toBe(value);
      await expect(unscharferelation2.get()).rejects.toThrow(UnscharferelationError);
      await expect(unscharferelation3.get()).rejects.toThrow(error);
    });
  });

  describe('terminate', () => {
    it('returns Heisenberg subclass instance', async () => {
      expect.assertions(6);

      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError();

      const present: Heisenberg<number> = await UnscharferelationInternal.of<number>((epoque: Epoque<number>) => {
        epoque.accept(value);
      }).terminate();
      const absent: Heisenberg<number> = await UnscharferelationInternal.of<number>((epoque: Epoque<number>) => {
        epoque.decline();
      }).terminate();
      const lost: Heisenberg<number> = await UnscharferelationInternal.of<number>((epoque: Epoque<number>) => {
        epoque.throw(error);
      }).terminate();

      expect(present.isPresent()).toBe(true);
      expect(present.get()).toBe(value);
      expect(absent.isAbsent()).toBe(true);
      expect(() => {
        absent.get();
      }).toThrow(UnscharferelationError);
      expect(lost.isLost()).toBe(true);
      expect(() => {
        lost.get();
      }).toThrow(error);
    });
  });

  describe('filter', () => {
    it('Present: predicate returns true', async () => {
      expect.assertions(2);

      const value: number = -201;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
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

    it('Present: predicate returns false', async () => {
      expect.assertions(2);

      const value: number = -201;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
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

    it('Absent: returns its copy inspite of the return value of filter', async () => {
      expect.assertions(4);

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
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

      expect(heisenberg1.isAbsent()).toBe(true);
      expect(() => {
        heisenberg1.get();
      }).toThrow(UnscharferelationError);
      expect(heisenberg2.isAbsent()).toBe(true);
      expect(() => {
        heisenberg2.get();
      }).toThrow(UnscharferelationError);
    });

    it('Lost: returns its copy', async () => {
      expect.assertions(4);

      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
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

      expect(heisenberg1.isLost()).toBe(true);
      expect(() => {
        heisenberg1.get();
      }).toThrow(error);
      expect(heisenberg2.isLost()).toBe(true);
      expect(() => {
        heisenberg2.get();
      }).toThrow(error);
    });
  });

  describe('map', () => {
    it('sync case', async () => {
      expect.assertions(6);

      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return v + 1;
      }).map<number>((v: number) => {
        spy2();
        expect(v).toBe(value + 1);

        return v + 1;
      }).map<number>((v: number) => {
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

      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.resolve<number>(v + 1);
      }).map<number>((v: number) => {
        spy2();
        expect(v).toBe(value + 1);

        return Promise.resolve<number>(v + 1);
      }).map<number>((v: number) => {
        spy3();
        expect(v).toBe(value + 2);

        return Promise.resolve<number>(v + 1);
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('sync Present Unscharferelation case', async () => {
      expect.assertions(6);

      const value1: number = -201;
      const value2: number = -20100;
      const value3: number = -20100;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value1);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value2);
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value3);
        }
      );
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value1);

        return unscharferelation2;
      }).map<number>((v: number) => {
        spy2();
        expect(v).toBe(value2);

        return unscharferelation3;
      }).map<number>((v: number) => {
        spy3();
        expect(v).toBe(value3);

        return unscharferelation3;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('async Present Unscharferelation case', async () => {
      expect.assertions(6);

      const value1: number = -201;
      const value2: number = -20100;
      const value3: number = -20100;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value1);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value2);
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value3);
        }
      );
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value1);

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation2);
      }).map<number>((v: number) => {
        spy2();
        expect(v).toBe(value2);

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation3);
      }).map<number>((v: number) => {
        spy3();
        expect(v).toBe(value3);

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation3);
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('sync case: returns null', async () => {
      expect.assertions(4);

      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return null;
      }).map<number>(() => {
        spy2();

        return null;
      }).map<number>(() => {
        spy3();

        return null;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });

    it('async case: returns Promise null', async () => {
      expect.assertions(4);

      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.resolve<null>(null);
      }).map<number>(() => {
        spy2();

        return Promise.resolve<null>(null);
      }).map<number>(() => {
        spy3();

        return Promise.resolve<null>(null);
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });

    it('sync Absent Unscharferelation case', async () => {
      expect.assertions(4);

      const value: number = -201;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return unscharferelation2;
      }).map<number>(() => {
        spy2();

        return unscharferelation3;
      }).map<number>(() => {
        spy3();

        return unscharferelation3;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });

    it('async Absent Unscharferelation case', async () => {
      expect.assertions(4);

      const value: number = -201;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation2);
      }).map<number>(() => {
        spy2();

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation3);
      }).map<number>(() => {
        spy3();

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation3);
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });

    it('sync case: throw error', async () => {
      expect.assertions(5);

      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await unscharferelation.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        throw error;
      }).map<number>(() => {
        spy2();

        throw error;
      }).map<number>(() => {
        spy3();

        throw error;
      }).recover<number>(() => {
        spy4();

        throw error;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('async case: returns Promise reject', async () => {
      expect.assertions(5);

      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await unscharferelation.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.reject<null>(error);
      }).map<number>(() => {
        spy2();

        return Promise.reject<null>(error);
      }).map<number>(() => {
        spy3();

        return Promise.reject<null>(error);
      }).recover<number>(() => {
        spy4();

        return Promise.reject<null>(error);
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('Lost Unscharferelation case', async () => {
      expect.assertions(5);

      const value: number = -201;
      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const error3: MockRuntimeError = new MockRuntimeError();

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error1);
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error2);
        }
      );
      const unscharferelation4: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error3);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return unscharferelation2;
      }).map<number>(() => {
        spy2();

        return unscharferelation3;
      }).map<number>(() => {
        spy3();

        return unscharferelation4;
      }).recover<number>(() => {
        spy4();

        return unscharferelation4;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('already accepted Unscharferelation case', async () => {
      expect.assertions(6);

      const value1: number = -201;
      const value2: number = -220;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value1);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value2);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value1);

        return unscharferelation2;
      }).map<number>((v: number) => {
        spy2();
        expect(v).toBe(value2);

        return unscharferelation2;
      }).map<number>((v: number) => {
        spy3();
        expect(v).toBe(value2);

        return unscharferelation2;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('already declined Unscharferelation case', async () => {
      expect.assertions(4);

      const value: number = -201;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return unscharferelation2;
      }).recover<number>(() => {
        spy2();

        return unscharferelation2;
      }).recover<number>(() => {
        spy3();

        return unscharferelation2;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('already thrown Unscharferelation case', async () => {
      expect.assertions(4);

      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return unscharferelation2;
      }).recover<number>(() => {
        spy2();

        return unscharferelation2;
      }).map<number>(() => {
        spy3();

        return unscharferelation2;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });
  });

  describe('recover', () => {
    it('sync case', async () => {
      expect.assertions(4);

      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation.map<number>((v: number) => {
        spy1();

        return v + 1;
      }).recover<number>(() => {
        spy2();

        return value + 23;
      }).map<number>((v: number) => {
        spy3();
        expect(v).toBe(value + 23);

        return v + 230;
      }).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('async case', async () => {
      expect.assertions(4);

      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation.map<number>((v: number) => {
        spy1();

        return Promise.resolve<number>(v + 23);
      }).recover<number>(() => {
        spy2();

        return Promise.resolve<number>(value + 23);
      }).map<number>((v: number) => {
        spy3();
        expect(v).toBe(value + 23);

        return Promise.resolve<number>(value + 23);
      }).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('sync Present Unscharferelation case', async () => {
      expect.assertions(4);

      const value1: number = -20100;
      const value2: number = -2010;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value1);
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value2);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>(() => {
        spy1();

        return unscharferelation2;
      }).recover<number>(() => {
        spy2();

        return unscharferelation3;
      }).map<number>((v: number) => {
        spy3();
        expect(v).toBe(value2);

        return unscharferelation3;
      }).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('async Present Unscharferelation case', async () => {
      expect.assertions(4);

      const value1: number = -20100;
      const value2: number = -2010;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value1);
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value2);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>(() => {
        spy1();

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation2);
      }).recover<number>(() => {
        spy2();

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation3);
      }).map<number>((v: number) => {
        spy3();
        expect(v).toBe(value2);

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation3);
      }).terminate();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('sync case: returns null', async () => {
      expect.assertions(4);

      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation.recover<number>(() => {
        spy1();

        return null;
      }).recover<number>(() => {
        spy2();

        return value + 23;
      }).map<number>((v: number) => {
        spy3();
        expect(v).toBe(value + 23);

        return v + 230;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy2.called).toBe(true);
    });

    it('async case: returns accepted null', async () => {
      expect.assertions(4);

      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation.recover<number>(() => {
        spy1();

        return Promise.resolve<null>(null);
      }).recover<number>(() => {
        spy2();

        return value + 23;
      }).map<number>((v: number) => {
        spy3();
        expect(v).toBe(value + 23);

        return v + 230;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('sync Absent Unscharferelation case', async () => {
      expect.assertions(4);

      const value: number = -201;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return unscharferelation2;
      }).recover<number>(() => {
        spy2();

        return unscharferelation3;
      }).map<number>(() => {
        spy3();

        return unscharferelation3;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('async Absent Unscharferelation case', async () => {
      expect.assertions(4);

      const value: number = -201;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation2);
      }).recover<number>(() => {
        spy2();

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation3);
      }).map<number>(() => {
        spy3();

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation3);
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('sync case: throw error', async () => {
      expect.assertions(5);

      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await unscharferelation.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        throw error;
      }).recover<number>(() => {
        spy2();

        throw error;
      }).map<number>(() => {
        spy3();

        throw error;
      }).recover<number>(() => {
        spy4();

        throw error;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('async case: returns Promise reject', async () => {
      expect.assertions(5);

      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await unscharferelation.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.reject<null>(error);
      }).recover<number>(() => {
        spy2();

        return Promise.reject<null>(error);
      }).map<number>(() => {
        spy3();

        return Promise.reject<null>(error);
      }).recover<number>(() => {
        spy4();

        throw error;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('Lost Unscharferelation case', async () => {
      expect.assertions(5);

      const value: number = -201;
      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const error3: MockRuntimeError = new MockRuntimeError();

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error1);
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error2);
        }
      );
      const unscharferelation4: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error3);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return unscharferelation2;
      }).recover<number>(() => {
        spy2();

        return unscharferelation3;
      }).map<number>(() => {
        spy3();

        return unscharferelation4;
      }).recover<number>(() => {
        spy4();

        return unscharferelation4;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('Promise<Lost Unscharferelation> case', async () => {
      expect.assertions(5);

      const value: number = -201;
      const error1: MockRuntimeError = new MockRuntimeError();
      const error2: MockRuntimeError = new MockRuntimeError();
      const error3: MockRuntimeError = new MockRuntimeError();

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error1);
        }
      );
      const unscharferelation3: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error2);
        }
      );
      const unscharferelation4: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error3);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation2);
      }).recover<number>(() => {
        spy2();

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation3);
      }).map<number>(() => {
        spy3();

        return Promise.resolve<UnscharferelationInternal<number>>(unscharferelation3);
      }).recover<number>(() => {
        spy4();

        return unscharferelation4;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('already accepted Unscharferelation case', async () => {
      expect.assertions(6);

      const value1: number = -201;
      const value2: number = -201;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value1);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value2);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value1);

        return unscharferelation2;
      }).map<number>((v: number) => {
        spy2();
        expect(v).toBe(value2);

        return unscharferelation2;
      }).map<number>((v: number) => {
        spy3();
        expect(v).toBe(value2);

        return unscharferelation2;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('already declined Unscharferelation case', async () => {
      expect.assertions(4);

      const value: number = -201;

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return unscharferelation2;
      }).recover<number>(() => {
        spy2();

        return unscharferelation2;
      }).recover<number>(() => {
        spy3();

        return unscharferelation2;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(true);
    });

    it('already thrown Unscharferelation case', async () => {
      expect.assertions(4);

      const value: number = -201;
      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelation1: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );
      const unscharferelation2: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await unscharferelation1.map<number>((v: number) => {
        spy1();
        expect(v).toBe(value);

        return unscharferelation2;
      }).recover<number>(() => {
        spy2();

        return unscharferelation2;
      }).map<number>(() => {
        spy3();

        return unscharferelation2;
      }).terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });
  });

  describe('ifPresent', () => {
    it('if Present, the callback will be invoked', async () => {
      expect.assertions(3);

      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const spy: SinonSpy = sinon.spy();

      const heisenberg: Heisenberg<number> = await unscharferelation.ifPresent((v: number) => {
        spy();
        expect(v).toBe(value);
      }).terminate();

      expect(spy.called).toBe(true);
      expect(heisenberg.isPresent()).toBe(true);
    });

    it('if Absent, the callback will not be invoked', async () => {
      expect.assertions(2);

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy: SinonSpy = sinon.spy();

      const heisenberg: Heisenberg<number> = await unscharferelation.ifPresent(() => {
        spy();
      }).terminate();

      expect(spy.called).toBe(false);
      expect(heisenberg.isAbsent()).toBe(true);
    });

    it('if Lost, the callback will not be invoked', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      const spy: SinonSpy = sinon.spy();

      const heisenberg: Heisenberg<number> = await unscharferelation.ifPresent(() => {
        spy();
      }).terminate();

      expect(spy.called).toBe(false);
      expect(heisenberg.isLost()).toBe(true);
    });
  });

  describe('ifAbsent', () => {
    it('if Present, the callback will not be invoked', async () => {
      expect.assertions(3);

      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const spy: SinonSpy = sinon.spy();

      const heisenberg: Heisenberg<number> = await unscharferelation.ifAbsent(() => {
        spy();
      }).terminate();

      expect(spy.called).toBe(false);
      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('if Absent, the callback will be invoked', async () => {
      expect.assertions(2);

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy: SinonSpy = sinon.spy();

      const heisenberg: Heisenberg<number> = await unscharferelation.ifAbsent(() => {
        spy();
      }).terminate();

      expect(spy.called).toBe(true);
      expect(heisenberg.isAbsent()).toBe(true);
    });

    it('if Lost, the callback will not be invoked', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      const spy: SinonSpy = sinon.spy();

      const heisenberg: Heisenberg<number> = await unscharferelation.ifAbsent(() => {
        spy();
      }).terminate();

      expect(spy.called).toBe(false);
      expect(heisenberg.isLost()).toBe(true);
    });
  });

  describe('ifLost', () => {
    it('if Present, the callback will not be invoked', async () => {
      expect.assertions(3);

      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const spy: SinonSpy = sinon.spy();

      const heisenberg: Heisenberg<number> = await unscharferelation.ifLost(() => {
        spy();
      }).terminate();

      expect(spy.called).toBe(false);
      expect(heisenberg.isPresent()).toBe(true);
      expect(heisenberg.get()).toBe(value);
    });

    it('if Absent, the callback will not be invoked', async () => {
      expect.assertions(2);

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy: SinonSpy = sinon.spy();

      const heisenberg: Heisenberg<number> = await unscharferelation.ifLost(() => {
        spy();
      }).terminate();

      expect(spy.called).toBe(false);
      expect(heisenberg.isAbsent()).toBe(true);
    });

    it('if Lost, the callback will be invoked', async () => {
      expect.assertions(3);

      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      const spy: SinonSpy = sinon.spy();

      const heisenberg: Heisenberg<number> = await unscharferelation.ifLost((e: unknown) => {
        spy();
        expect(e).toBe(error);
      }).terminate();

      expect(spy.called).toBe(true);
      expect(heisenberg.isLost()).toBe(true);
    });
  });

  describe('pass', () => {
    it('accept case', () => {
      expect.assertions(4);

      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      unscharferelation.pass(
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

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      unscharferelation.pass(
        () => {
          spy1();
        },
        () => {
          spy2();
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

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      unscharferelation.pass(
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

      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const spy: SinonSpy = sinon.spy();

      unscharferelation.peek(() => {
        spy();
      });

      expect(spy.called).toBe(true);
    });

    it('decline case', () => {
      expect.assertions(1);

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const spy: SinonSpy = sinon.spy();

      unscharferelation.peek(() => {
        spy();
      });

      expect(spy.called).toBe(true);
    });

    it('throw case', () => {
      expect.assertions(1);

      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      const spy: SinonSpy = sinon.spy();

      unscharferelation.peek(() => {
        spy();
      });

      expect(spy.called).toBe(true);
    });
  });

  describe('toSuperposition', () => {
    it('Present: will transform to Alive', async () => {
      expect.assertions(2);

      const value: number = -201;

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.accept(value);
        }
      );

      const schrodinger: Schrodinger<number, UnscharferelationError> = await unscharferelation.toSuperposition().terminate();

      expect(schrodinger.isAlive()).toBe(true);
      expect(schrodinger.get()).toBe(value);
    });

    it('Present: if the value is Error, will transform to Dead', async () => {
      expect.assertions(2);

      const value: MockRuntimeError = new MockRuntimeError();

      const unscharferelation: UnscharferelationInternal<MockRuntimeError> = UnscharferelationInternal.of<MockRuntimeError>(
        (epoque: Epoque<MockRuntimeError>) => {
          epoque.accept(value);
        }
      );

      const schrodinger: Schrodinger<MockRuntimeError, UnscharferelationError> = await unscharferelation.toSuperposition().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(UnscharferelationError);
    });

    it('Absent: will transform to Dead', async () => {
      expect.assertions(2);

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.decline();
        }
      );

      const schrodinger: Schrodinger<number, UnscharferelationError> = await unscharferelation.toSuperposition().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(UnscharferelationError);
    });

    it('Lost: will transform to Contradiction', async () => {
      expect.assertions(2);

      const error: MockRuntimeError = new MockRuntimeError();

      const unscharferelation: UnscharferelationInternal<number> = UnscharferelationInternal.of<number>(
        (epoque: Epoque<number>) => {
          epoque.throw(error);
        }
      );

      const schrodinger: Schrodinger<number, UnscharferelationError> = await unscharferelation.toSuperposition().terminate();

      expect(schrodinger.isContradiction()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(error);
    });
  });
});
