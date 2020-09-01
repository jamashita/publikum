import sinon, { SinonSpy } from 'sinon';
import { CombinedEpoque } from '../CombinedEpoque';

describe('CombinedEpoque', () => {
  describe('accept', () => {
    it('normal case', () => {
      const value: number = -35;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: CombinedEpoque<number, number> = CombinedEpoque.of<number, number>(
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

      epoque.accept(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });
  });

  describe('decline', () => {
    it('normal case', () => {
      const value: number = -35;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: CombinedEpoque<number, number> = CombinedEpoque.of<number, number>(
        () => {
          spy1();
        },
        (v: number) => {
          spy2();
          expect(v).toBe(value);
        },
        () => {
          spy3();
        }
      );

      epoque.decline(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });
  });

  describe('throw', () => {
    it('normal case', () => {
      const value: number = -35;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const epoque: CombinedEpoque<number, number> = CombinedEpoque.of<number, number>(
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

      epoque.throw(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
