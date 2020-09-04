import { MockError } from '@jamashita/publikum-object';
import sinon, { SinonSpy } from 'sinon';
import { DeadConstructor } from '../../Interface/DeadConstructor';
import { CombinedChrono } from '../CombinedChrono';
import { PassThroughChrono } from '../PassThroughChrono';

describe('CombinedChrono', () => {
  describe('accept', () => {
    it('normal case', () => {
      expect.assertions(4);
      const value: number = -35;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const pass: PassThroughChrono<number, MockError> = PassThroughChrono.of<number, MockError>(
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
      const chrono: CombinedChrono<number, MockError> = CombinedChrono.of<number, MockError>(pass, pass, pass);

      chrono.accept(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });
  });

  describe('decline', () => {
    it('normal case', () => {
      expect.assertions(4);
      const value: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const pass: PassThroughChrono<number, MockError> = PassThroughChrono.of<number, MockError>(
        () => {
          spy1();
        },
        (v: MockError) => {
          spy2();
          expect(v).toBe(value);
        },
        () => {
          spy3();
        },
        new Set<DeadConstructor<MockError>>()
      );
      const chrono: CombinedChrono<number, MockError> = CombinedChrono.of<number, MockError>(pass, pass, pass);

      chrono.decline(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });
  });

  describe('throw', () => {
    it('normal case', () => {
      expect.assertions(4);
      const value: number = -35;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const pass: PassThroughChrono<number, MockError> = PassThroughChrono.of<number, MockError>(
        () => {
          spy1();
        },
        () => {
          spy2();
        },
        (v: unknown) => {
          spy3();
          expect(v).toBe(value);
        },
        new Set<DeadConstructor<MockError>>()
      );
      const chrono: CombinedChrono<number, MockError> = CombinedChrono.of<number, MockError>(pass, pass, pass);

      chrono.throw(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
