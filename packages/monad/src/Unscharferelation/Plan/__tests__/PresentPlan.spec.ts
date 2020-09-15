import { MockRuntimeError } from '@jamashita/publikum-error';
import { Resolve } from '@jamashita/publikum-type';
import sinon, { SinonSpy } from 'sinon';
import { Epoque } from '../../Epoque/Interface/Epoque';
import { MockEpoque } from '../../Epoque/Mock/MockEpoque';
import { Unscharferelation } from '../../Unscharferelation';
import { PresentPlan } from '../PresentPlan';

describe('PresentPlan', () => {
  describe('onMap', () => {
    it('p given', () => {
      expect.assertions(6);
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

          return n - 6;
        },
        new MockEpoque<number>(
          (n: number) => {
            spy2();
            expect(n).toBe(value - 6);
          },
          () => {
            spy3();
          },
          () => {
            spy4();
          }
        )
      );

      plan.onMap(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('promise<P> given', async () => {
      expect.assertions(6);
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Promise.resolve<number>(n - 6);
          },
          new MockEpoque<number>(
            (n: number) => {
              spy2();
              expect(n).toBe(value - 6);

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            () => {
              spy4();

              resolve();
            }
          )
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('present Unscharferelation given', async () => {
      expect.assertions(6);
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Unscharferelation.of<number>((e: Epoque<number>) => {
              return e.accept(value - 6);
            });
          },
          new MockEpoque<number>(
            (n: number) => {
              spy2();
              expect(n).toBe(value - 6);

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            () => {
              spy4();

              resolve();
            }
          )
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('promise<Present Unscharferelation> given', async () => {
      expect.assertions(6);
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Promise.resolve<Unscharferelation<number>>(Unscharferelation.of<number>((e: Epoque<number>) => {
              return e.accept(value - 6);
            }));
          },
          new MockEpoque<number>(
            (n: number) => {
              spy2();
              expect(n).toBe(value - 6);

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            () => {
              spy4();

              resolve();
            }
          )
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('null given', () => {
      expect.assertions(5);
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

          return null;
        },
        new MockEpoque<number>(
          () => {
            spy2();
          },
          () => {
            spy3();
          },
          () => {
            spy4();
          }
        )
      );

      plan.onMap(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('undefined given', async () => {
      expect.assertions(5);
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return undefined;
          },
          new MockEpoque<number>(
            () => {
              spy2();

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            () => {
              spy4();

              resolve();
            }
          )
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('promise<null> given', async () => {
      expect.assertions(5);
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Promise.resolve<null>(null);
          },
          new MockEpoque<number>(
            () => {
              spy2();

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            () => {
              spy4();

              resolve();
            }
          )
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('promise<undefined> given', async () => {
      expect.assertions(4);
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          () => {
            spy1();

            return Promise.resolve<undefined>(undefined);
          },
          new MockEpoque<number>(
            () => {
              spy2();

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            () => {
              spy4();

              resolve();
            }
          )
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('absent Unscharferelation given', async () => {
      expect.assertions(5);
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Unscharferelation.of<number>((e: Epoque<number>) => {
              return e.decline();
            });
          },
          new MockEpoque<number>(
            () => {
              spy2();

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            () => {
              spy4();

              resolve();
            }
          )
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('promise<absent Unscharferelation> given', async () => {
      expect.assertions(5);
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Promise.resolve<Unscharferelation<number>>(Unscharferelation.absent<number>());
          },
          new MockEpoque<number>(
            () => {
              spy2();

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            () => {
              spy4();

              resolve();
            }
          )
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('error thrown', () => {
      expect.assertions(6);
      const value: number = 10;
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

          throw error;
        },
        new MockEpoque<number>(
          () => {
            spy2();
          },
          () => {
            spy3();
          },
          (n: unknown) => {
            spy4();
            expect(n).toBe(error);
          }
        )
      );

      plan.onMap(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('promise rejected given', async () => {
      expect.assertions(6);
      const value: number = 10;
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Promise.reject<number>(error);
          },
          new MockEpoque<number>(
            () => {
              spy2();

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            (n: unknown) => {
              spy4();
              expect(n).toBe(error);

              resolve();
            }
          )
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('lost Unscharferelation given', async () => {
      expect.assertions(6);
      const value: number = 10;
      const error: MockRuntimeError = new MockRuntimeError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Unscharferelation.of<number>((e: Epoque<number>) => {
              return e.throw(error);
            });
          },
          new MockEpoque<number>(
            () => {
              spy2();

              resolve();
            },
            () => {
              spy3();

              resolve();
            },
            (n: unknown) => {
              spy4();
              expect(n).toBe(error);

              resolve();
            }
          )
        );

        plan.onMap(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });
  });
});
