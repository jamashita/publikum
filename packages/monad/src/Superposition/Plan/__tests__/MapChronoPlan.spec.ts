import { MockError } from '@jamashita/publikum-object';
import sinon, { SinonSpy } from 'sinon';
import { MockChrono } from '../../Chrono/Mock/MockChrono';
import { DeadConstructor } from '../../Interface/DeadConstructor';
import { MapChronoPlan } from '../MapChronoPlan';

describe('MapChronoPlan', () => {
  describe('onMap', () => {
    it('normal case', () => {
      expect.assertions(4);
      const value: number = -35;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const chrono: MockChrono<number, MockError> = new MockChrono<number, MockError>(
        (v: number) => {
          spy1();
          expect(v).toBe(value);
        },
        () => {
          spy2();
        },
        () => {
          spy3();
        },
        new Set<DeadConstructor<MockError>>()
      );
      const plan: MapChronoPlan<number, MockError> = MapChronoPlan.of<number, MockError>(chrono);

      plan.onMap(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });
  });
});