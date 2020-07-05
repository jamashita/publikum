import sinon, { SinonSpy } from 'sinon';

import { AcceptEpoque } from '../../Epoque/Interface/AcceptEpoque';
import { PassEpoque } from '../../Epoque/PassEpoque';
import { MappingPeekPlan } from '../MappingPeekPlan';

describe('MappingPeekPlan', () => {
  describe('onMap', () => {
    it('sync', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: AcceptEpoque<void> = PassEpoque.of<void, unknown>(
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
      const plan: MappingPeekPlan = MappingPeekPlan.of(epoque);

      plan.onMap();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });

    it('async', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: AcceptEpoque<void> = PassEpoque.of<void, unknown>(
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
      const plan: MappingPeekPlan = MappingPeekPlan.of(epoque);

      plan.onMap();

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });
  });
});