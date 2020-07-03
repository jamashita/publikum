import sinon, { SinonSpy } from 'sinon';

import { AcceptEpoque } from '../../Epoque/Interface/AcceptEpoque';
import { PassEpoque } from '../../Epoque/PassEpoque';
import { MappingConsumerPlan } from '../MappingConsumerPlan';

describe('MappingConsumerPlan', () => {
  describe('onMap', () => {
    it('sync', () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: AcceptEpoque<number> = PassEpoque.of<number, unknown>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);
        },
        () => {
          spy2();
        },
        () => {
          spy3();
        }
      );
      const plan: MappingConsumerPlan<number> = MappingConsumerPlan.of<number>(epoque);

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
        async (n: number) => {
          spy1();
          expect(n).toBe(value);
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
      const plan: MappingConsumerPlan<number> = MappingConsumerPlan.of<number>(epoque);

      plan.onMap(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });
  });
});
