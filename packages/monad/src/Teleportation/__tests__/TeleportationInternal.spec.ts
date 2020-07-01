import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';

import { Epoque } from '../../Epoque/Interface/Epoque';
import { Bennett } from '../Bennett/Bennett';
import { TeleportationInternal } from '../TeleportationInternal';

describe('TeleportationInternal', () => {
  // TODO CANCEL()
  describe('get', () => {
    it('returns inner value', async () => {
      const value: number = 14;

      const teleportation: TeleportationInternal<number> = TeleportationInternal.of<number>(
        (epoque: Epoque<number, Error>) => {
          epoque.resolve(value);
        }
      );

      await expect(teleportation.get()).resolves.toBe(value);
    });

    it('throws inner error', async () => {
      const error: MockError = new MockError();

      const teleportation: TeleportationInternal<number> = TeleportationInternal.of<number>(
        (epoque: Epoque<number, Error>) => {
          epoque.reject(error);
        }
      );

      await expect(teleportation.get()).rejects.toBe(error);
    });
  });

  describe('terminate', () => {
    it('returns Bennett subclass instance', async () => {
      const value: number = 14;
      const error: MockError = new MockError();

      const received: Bennett<number> = await TeleportationInternal.of<number>((epoque: Epoque<number, Error>) => {
        epoque.resolve(value);
      }).terminate();
      const disappeared: Bennett<number> = await TeleportationInternal.of<number>((epoque: Epoque<number, Error>) => {
        epoque.reject(error);
      }).terminate();

      expect(received.isReceived()).toBe(true);
      expect(received.get()).toBe(value);
      expect(disappeared.isDisappeared()).toBe(true);
      expect(() => {
        disappeared.get();
      }).toThrow(MockError);
    });
  });

  describe('then', () => {
    it('returns inner value', async () => {
      const value: number = 14;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const teleportation: TeleportationInternal<number> = TeleportationInternal.of<number>(
        (epoque: Epoque<number, Error>) => {
          epoque.resolve(value);
        }
      );

      await teleportation.then<void, void>(
        (v: number) => {
          spy1();
          expect(v).toBe(value);
        },
        () => {
          spy2();
        }
      );

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });

    it('throws inner error', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const teleportation: TeleportationInternal<number> = TeleportationInternal.of<number>(
        (epoque: Epoque<number, Error>) => {
          epoque.reject(error);
        }
      );

      await teleportation.then<void, void>(
        () => {
          spy1();
        },
        (e: unknown) => {
          spy2();
          expect(e).toBe(error);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('map', () => {
    it('sync', async () => {
      const value: number = 14;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const teleportation: TeleportationInternal<number> = TeleportationInternal.of<number>(
        (epoque: Epoque<number, Error>) => {
          epoque.resolve(value);
        }
      );

      await teleportation
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return v + 3;
        })
        .map<void>((v: number) => {
          spy2();
          expect(v).toBe(value + 3);
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });

    it('sync: throws error', async () => {
      const value: number = 14;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const teleportation: TeleportationInternal<number> = TeleportationInternal.of<number>(
        (epoque: Epoque<number, Error>) => {
          epoque.resolve(value);
        }
      );

      await teleportation
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          throw error;
        })
        .map<void>(() => {
          spy2();
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });

    it('sync: multiple handlers', async () => {
      const value: number = 14;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const teleportation: TeleportationInternal<number> = TeleportationInternal.of<number>(
        (epoque: Epoque<number, Error>) => {
          epoque.resolve(value);
        }
      );

      const promise1: Promise<Bennett<number>> = teleportation
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return v + 3;
        })
        .terminate();

      const promise2: Promise<Bennett<void>> = teleportation
        .map<void>((v: number) => {
          spy2();
          expect(v).toBe(value);
        })
        .terminate();

      await promise1;
      await promise2;

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });

    it('sync: handle immediately for recieved Teleportation', async () => {
      const value: number = 14;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const teleportation: TeleportationInternal<number> = TeleportationInternal.of<number>(
        (epoque: Epoque<number, Error>) => {
          epoque.resolve(value);
        }
      );

      await teleportation
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return v + 3;
        })
        .terminate();

      await teleportation.map<void>((v: number) => {
        spy2();
        expect(v).toBe(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });

    it('async', async () => {
      const value: number = 14;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const teleportation: TeleportationInternal<number> = TeleportationInternal.of<number>(
        (epoque: Epoque<number, Error>) => {
          epoque.resolve(value);
        }
      );

      await teleportation
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return Promise.resolve<number>(v + 3);
        })
        .map<void>((v: number) => {
          spy2();
          expect(v).toBe(value + 3);
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });

    it('async: rejects error', async () => {
      const value: number = 14;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const teleportation: TeleportationInternal<number> = TeleportationInternal.of<number>(
        (epoque: Epoque<number, Error>) => {
          epoque.resolve(value);
        }
      );

      await teleportation
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return Promise.reject<number>(error);
        })
        .map<void>((v: number) => {
          spy2();
          expect(v).toBe(value + 3);
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });

    it('async: multiple handlers', async () => {
      const value: number = 14;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const teleportation: TeleportationInternal<number> = TeleportationInternal.of<number>(
        (epoque: Epoque<number, Error>) => {
          epoque.resolve(value);
        }
      );

      const promise1: Promise<Bennett<number>> = teleportation
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return Promise.resolve<number>(v + 3);
        })
        .terminate();

      const promise2: Promise<Bennett<void>> = teleportation
        .map<void>((v: number) => {
          spy2();
          expect(v).toBe(value);
        })
        .terminate();

      await promise1;
      await promise2;

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });

    it('async: handle immediately for recieved Teleportation', async () => {
      const value: number = 14;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const teleportation: TeleportationInternal<number> = TeleportationInternal.of<number>(
        (epoque: Epoque<number, Error>) => {
          epoque.resolve(value);
        }
      );

      await teleportation
        .map<number>((v: number) => {
          spy1();
          expect(v).toBe(value);

          return Promise.resolve<number>(v + 3);
        })
        .terminate();

      await teleportation
        .map<void>((v: number) => {
          spy2();
          expect(v).toBe(value);
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });
  });

  describe('recover', () => {
    it('sync', async () => {
      const error: MockError = new MockError();
      const value: number = 14;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const teleportation: TeleportationInternal<number> = TeleportationInternal.of<number>(
        (epoque: Epoque<number, Error>) => {
          epoque.reject(error);
        }
      );

      await teleportation
        .recover<number>((e: Error) => {
          spy1();
          expect(e).toBe(error);

          return value + 3;
        })
        .map<void>((v: number) => {
          spy2();
          expect(v).toBe(value + 3);
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });

    it('sync: throws error', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const teleportation: TeleportationInternal<number> = TeleportationInternal.of<number>(
        (epoque: Epoque<number, Error>) => {
          epoque.reject(error);
        }
      );

      await teleportation
        .recover<number>((e: Error) => {
          spy1();
          expect(e).toBe(error);

          throw error;
        })
        .map<void>(() => {
          spy2();
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });

    it('sync: multiple handlers', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const teleportation: TeleportationInternal<number> = TeleportationInternal.of<number>(
        (epoque: Epoque<number, Error>) => {
          epoque.reject(error);
        }
      );

      const promise1: Promise<Bennett<number | void>> = teleportation
        .recover<void>((e: Error) => {
          spy1();
          expect(e).toBe(error);
        })
        .terminate();

      const promise2: Promise<Bennett<number | void>> = teleportation
        .recover<void>((e: Error) => {
          spy2();
          expect(e).toBe(error);
        })
        .terminate();

      await promise1;
      await promise2;

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });

    it('sync: handle immediately for recieved Teleportation', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const teleportation: TeleportationInternal<number> = TeleportationInternal.of<number>(
        (epoque: Epoque<number, Error>) => {
          epoque.reject(error);
        }
      );

      await teleportation
        .recover<void>((e: Error) => {
          spy1();
          expect(e).toBe(error);
        })
        .terminate();

      await teleportation
        .recover<void>((e: Error) => {
          spy2();
          expect(e).toBe(error);
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });

    it('async', async () => {
      const error: MockError = new MockError();
      const value: number = 14;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const teleportation: TeleportationInternal<number> = TeleportationInternal.of<number>(
        (epoque: Epoque<number, Error>) => {
          epoque.reject(error);
        }
      );

      await teleportation
        .recover<number>((e: Error) => {
          spy1();
          expect(e).toBe(error);

          return Promise.resolve<number>(value + 3);
        })
        .map<void>((v: number) => {
          spy2();
          expect(v).toBe(value + 3);
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });

    it('async: rejects error', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const teleportation: TeleportationInternal<number> = TeleportationInternal.of<number>(
        (epoque: Epoque<number, Error>) => {
          epoque.reject(error);
        }
      );

      await teleportation
        .recover<number>((e: Error) => {
          spy1();
          expect(e).toBe(error);

          return Promise.reject<number>(error);
        })
        .map<void>(() => {
          spy2();
        })
        .terminate();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });

    it('async: multiple handlers', async () => {
      const error: MockError = new MockError();
      const value: number = 14;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const teleportation: TeleportationInternal<number> = TeleportationInternal.of<number>(
        (epoque: Epoque<number, Error>) => {
          epoque.reject(error);
        }
      );

      const promise1: Promise<Bennett<number>> = teleportation
        .recover<number>((e: Error) => {
          spy1();
          expect(e).toBe(error);

          return Promise.resolve<number>(value + 3);
        })
        .terminate();

      const promise2: Promise<Bennett<number | void>> = teleportation
        .recover<void>((e: Error) => {
          spy2();
          expect(e).toBe(error);
        })
        .terminate();

      await promise1;
      await promise2;

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });

    it('async: handle immediately for recieved Teleportation', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const teleportation: TeleportationInternal<number> = TeleportationInternal.of<number>(
        (epoque: Epoque<number, Error>) => {
          epoque.reject(error);
        }
      );

      await teleportation
        .recover<void>((e: Error) => {
          spy1();
          expect(e).toBe(error);
        })
        .terminate();

      await teleportation.recover<void>((e: Error) => {
        spy2();
        expect(e).toBe(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
    });
  });
});
