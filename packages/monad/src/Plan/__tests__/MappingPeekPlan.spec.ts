import sinon, { SinonSpy } from 'sinon';

import { ResolveEpoque } from '../../Epoque/Interface/ResolveEpoque';
import { PassEpoque } from '../../Epoque/PassEpoque';
import { MappingPeekPlan } from '../MappingPeekPlan';

describe('MappingPeekPlan', () => {
  describe('onResolve', () => {
    it('sync', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const epoque: ResolveEpoque<void> = PassEpoque.of<void, unknown>(
        () => {
          spy1();
        },
        () => {
          spy2();
        }
      );
      const plan: MappingPeekPlan = MappingPeekPlan.of(epoque);

      plan.onResolve();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });

    it('async', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const epoque: ResolveEpoque<void> = PassEpoque.of<void, unknown>(
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          spy1();
        },
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          spy2();
        }
      );
      const plan: MappingPeekPlan = MappingPeekPlan.of(epoque);

      plan.onResolve();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });
  });
});
