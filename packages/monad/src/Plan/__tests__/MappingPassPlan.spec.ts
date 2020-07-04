import sinon, { SinonSpy } from 'sinon';

import { AcceptEpoque } from '../../Epoque/Interface/AcceptEpoque';
import { PassEpoque } from '../../Epoque/PassEpoque';
import { MappingPassPlan } from '../MappingPassPlan';

describe('MappingPassPlan', () => {
  describe('onMap', () => {
    it('sync', () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: AcceptEpoque<number> = PassEpoque.of<number, unknown>(
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
      const plan: MappingPassPlan<number> = MappingPassPlan.of<number>(epoque);

      plan.onMap(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });

    it('async', () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: AcceptEpoque<number> = PassEpoque.of<number, unknown>(
        // eslint-disable-next-line @typescript-eslint/require-await
        async (v: number) => {
          spy1();
          expect(v).toBe(value);
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
      const plan: MappingPassPlan<number> = MappingPassPlan.of<number>(epoque);

      plan.onMap(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });
  });
});
