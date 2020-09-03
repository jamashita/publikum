import { MockError } from '@jamashita/publikum-object';
import sinon, { SinonSpy } from 'sinon';
import { PassThroughChrono } from '../PassThroughChrono';

describe('PassThroughChrono', () => {
  describe('accept', () => {
    it('normal case', () => {
      expect.assertions(4);
      const value: number = -35;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const chrono: PassThroughChrono<number, MockError> = PassThroughChrono.of<number, MockError>(
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

      const chrono: PassThroughChrono<number, MockError> = PassThroughChrono.of<number, MockError>(
        () => {
          spy1();
        },
        (v: MockError) => {
          spy2();
          expect(v).toBe(value);
        },
        () => {
          spy3();
        }
      );

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

      const chrono: PassThroughChrono<number, MockError> = PassThroughChrono.of<number, MockError>(
        () => {
          spy1();
        },
        () => {
          spy2();
        },
        (v: unknown) => {
          spy3();
          expect(v).toBe(value);
        }
      );

      chrono.throw(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
