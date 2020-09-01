import { MockError } from '@jamashita/publikum-object';
import { Resolve } from '@jamashita/publikum-type';
import sinon, { SinonSpy } from 'sinon';
import { CombinedEpoque } from '../../Epoque/CombinedEpoque';
import { Epoque } from '../../Epoque/Interface/Epoque';
import { Matter } from '../../Interface/Matter';
import { Unscharferelation } from '../../Unscharferelation';
import { PresentPlan } from '../PresentPlan';

describe('PresentPlan', () => {
  describe('onMap', () => {
    it('P given', () => {
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
        CombinedEpoque.of<number>(
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

    it('Promise<P> given', async () => {
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
          CombinedEpoque.of<number>(
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

    it('Present Unscharferelation given', async () => {
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

            return Unscharferelation.of<number>((epoque: Epoque<Matter<number>>) => {
              return epoque.accept(value - 6);
            });
          },
          CombinedEpoque.of<number>(
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
        CombinedEpoque.of<number>(
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
          CombinedEpoque.of<number>(
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
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('Promise<null> given', async () => {
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
          CombinedEpoque.of<number>(
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
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('Promise<undefined> given', async () => {
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

            return Promise.resolve<undefined>(undefined);
          },
          CombinedEpoque.of<number>(
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
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('Absent Unscharferelation given', async () => {
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

            return Unscharferelation.of<number>((epoque: Epoque<Matter<number>>) => {
              return epoque.decline();
            });
          },
          CombinedEpoque.of<number>(
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
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('error thrown', () => {
      const value: number = 10;
      const error: MockError = new MockError();

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
        CombinedEpoque.of<number>(
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

    it('Promise rejected given', async () => {
      const value: number = 10;
      const error: MockError = new MockError();

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
          CombinedEpoque.of<number>(
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

    it('Lost Unscharferelation given', async () => {
      const value: number = 10;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: PresentPlan<number, number> = PresentPlan.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Unscharferelation.of<number>((epoque: Epoque<Matter<number>>) => {
              return epoque.throw(error);
            });
          },
          CombinedEpoque.of<number>(
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
