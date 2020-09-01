import sinon, { SinonSpy } from 'sinon';
import { CombinedEpoque } from '../../Epoque/CombinedEpoque';
import { AcceptEpoque } from '../../Epoque/Interface/AcceptEpoque';
import { MappingEpoquePlan } from '../MappingEpoquePlan';

describe('MappingEpoquePlan', () => {
  describe('onMap', () => {
    it('sync', () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: AcceptEpoque<number> = CombinedEpoque.of<number>(
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
      const plan: MappingEpoquePlan<number> = MappingEpoquePlan.of<number>(epoque);

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

      const epoque: AcceptEpoque<number> = CombinedEpoque.of<number>(
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
      const plan: MappingEpoquePlan<number> = MappingEpoquePlan.of<number>(epoque);

      plan.onMap(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });
  });
});