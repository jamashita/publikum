import sinon, { SinonSpy } from 'sinon';
import { CombinedChrono } from '../../Chrono/CombinedChrono';
import { Chrono } from '../../Chrono/Interface/Chrono';
import { PassThroughChronoPlan } from '../PassThroughChronoPlan';

describe('PassThroughChronoPlan', () => {
  describe('onMap', () => {
    it('sync', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const chrono: Chrono<void, void> = CombinedChrono.of<void, void>(
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
      const plan: PassThroughChronoPlan = PassThroughChronoPlan.of(chrono);

      plan.onMap();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });

    it('async', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const chrono: Chrono<void, void> = CombinedChrono.of<void, void>(
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
      const plan: PassThroughChronoPlan = PassThroughChronoPlan.of(chrono);

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

      const chrono: Chrono<void, void> = CombinedChrono.of<void, void>(
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
      const plan: PassThroughChronoPlan = PassThroughChronoPlan.of(chrono);

      plan.onRecover();

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('async', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const chrono: Chrono<void, void> = CombinedChrono.of<void, void>(
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
      const plan: PassThroughChronoPlan = PassThroughChronoPlan.of(chrono);

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

      const chrono: Chrono<void, void> = CombinedChrono.of<void, void>(
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
      const plan: PassThroughChronoPlan = PassThroughChronoPlan.of(chrono);

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

      const chrono: Chrono<void, void> = CombinedChrono.of<void, void>(
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
      const plan: PassThroughChronoPlan = PassThroughChronoPlan.of(chrono);

      plan.onDestroy(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
