import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';
import { Resolve } from '@jamashita/publikum-type';

import { Epoque } from '../../../Epoque/Interface/Epoque';
import { PassEpoque } from '../../../Epoque/PassEpoque';
import { Matter } from '../../Interface/Matter';
import { Unscharferelation } from '../../Unscharferelation';
import { AbsentPlan } from '../AbsentPlan';

describe('AbsentPlan', () => {
  describe('onRecover', () => {
    it('P given', () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const plan: AbsentPlan<number> = AbsentPlan.of<number>(
        () => {
          spy1();

          return value - 6;
        },
        PassEpoque.of<number, void>(
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

      plan.onRecover();

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
        const plan: AbsentPlan<number> = AbsentPlan.of<number>(
          () => {
            spy1();

            return Promise.resolve<number>(value - 6);
          },
          PassEpoque.of<number, void>(
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

        plan.onRecover();
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
        const plan: AbsentPlan<number> = AbsentPlan.of<number>(
          () => {
            spy1();

            return Unscharferelation.of<number>((epoque: Epoque<Matter<number>, void>) => {
              return epoque.accept(value - 6);
            });
          },
          PassEpoque.of<number, void>(
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

        plan.onRecover();
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(false);
    });

    it('null given', async () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of<number>(
          () => {
            spy1();

            return null;
          },
          PassEpoque.of<number, void>(
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

        plan.onRecover();
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('undefined given', async () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of<number>(
          () => {
            spy1();

            return null;
          },
          PassEpoque.of<number, void>(
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

        plan.onRecover();
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('Promise<null> given', async () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of<number>(
          () => {
            spy1();

            return Promise.resolve<null>(null);
          },
          PassEpoque.of<number, void>(
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

        plan.onRecover();
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('Promise<undefined> given', async () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of<number>(
          () => {
            spy1();

            return Promise.resolve<undefined>(undefined);
          },
          PassEpoque.of<number, void>(
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

        plan.onRecover();
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('Absent Unscharferelation given', async () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of<number>(
          () => {
            spy1();

            return Unscharferelation.of<number>((epoque: Epoque<Matter<number>, void>) => {
              return epoque.decline();
            });
          },
          PassEpoque.of<number, void>(
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

        plan.onRecover();
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
      expect(spy4.called).toBe(false);
    });

    it('error thrown', () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const plan: AbsentPlan<number> = AbsentPlan.of<number>(
        () => {
          spy1();

          throw error;
        },
        PassEpoque.of<number, void>(
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

      plan.onRecover();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('Promise rejected given', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of<number>(
          () => {
            spy1();

            return Promise.reject<number>(error);
          },
          PassEpoque.of<number, void>(
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

        plan.onRecover();
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('Lost Unscharferelation given', async () => {
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const plan: AbsentPlan<number> = AbsentPlan.of<number>(
          () => {
            spy1();

            return Unscharferelation.of<number>((epoque: Epoque<Matter<number>, void>) => {
              return epoque.throw(error);
            });
          },
          PassEpoque.of<number, void>(
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

        plan.onRecover();
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });
  });
});
