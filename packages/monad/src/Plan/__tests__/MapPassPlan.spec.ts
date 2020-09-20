import sinon, { SinonSpy } from 'sinon';
import { MapPassPlan } from '../MapPassPlan';

describe('MapPassPlan', () => {
  describe('onMap', () => {
    it('normal case', () => {
      expect.assertions(2);

      const value: number = -35;

      const spy: SinonSpy = sinon.spy();

      const plan: MapPassPlan<number> = MapPassPlan.of<number>(
        (v: number) => {
          spy();
          expect(v).toBe(value);
        }
      );

      plan.onMap(value);

      expect(spy.called).toBe(true);
    });
  });
});
