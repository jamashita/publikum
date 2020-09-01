import sinon, { SinonSpy } from 'sinon';
import { CombinedEpoque } from '../../Epoque/CombinedEpoque';
import { Epoque } from '../../Epoque/Interface/Epoque';
import { PassThroughEpoquePlan } from '../PassThroughEpoquePlan';

describe('PassThroughEpoquePlan', () => {
  describe('onMap', () => {
    it('sync', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: Epoque<void> = CombinedEpoque.of<void>(
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
      const plan: PassThroughEpoquePlan = PassThroughEpoquePlan.of(epoque);

      plan.onMap();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });

    it('async', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: Epoque<void> = CombinedEpoque.of<void>(
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          spy1();
        },
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          spy2();
        },
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          spy3();
        }
      );
      const plan: PassThroughEpoquePlan = PassThroughEpoquePlan.of(epoque);

      plan.onMap();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });
  });

  describe('onRecover', () => {
    it('sync', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: Epoque<void> = CombinedEpoque.of<unknown>(
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
      const plan: PassThroughEpoquePlan = PassThroughEpoquePlan.of(epoque);

      plan.onRecover();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('async', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: Epoque<void> = CombinedEpoque.of<unknown>(
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          spy1();
        },
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          spy2();
        },
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          spy3();
        }
      );
      const plan: PassThroughEpoquePlan = PassThroughEpoquePlan.of(epoque);

      plan.onRecover();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });
  });

  describe('onDestroy', () => {
    it('sync', () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: Epoque<void> = CombinedEpoque.of<unknown>(
        () => {
          spy1();
        },
        () => {
          spy2();
        },
        (n: unknown) => {
          spy3();
          expect(n).toBe(value);
        }
      );
      const plan: PassThroughEpoquePlan = PassThroughEpoquePlan.of(epoque);

      plan.onDestroy(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('async', () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: Epoque<void> = CombinedEpoque.of<unknown>(
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          spy1();
        },
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          spy2();
        },
        // eslint-disable-next-line @typescript-eslint/require-await
        async (n: unknown) => {
          spy3();
          expect(n).toBe(value);
        }
      );
      const plan: PassThroughEpoquePlan = PassThroughEpoquePlan.of(epoque);

      plan.onDestroy(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
