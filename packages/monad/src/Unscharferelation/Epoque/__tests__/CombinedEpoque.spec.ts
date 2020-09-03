import sinon, { SinonSpy } from 'sinon';
import { CombinedEpoque } from '../CombinedEpoque';
import { PassThroughEpoque } from '../PassThroughEpoque';

describe('CombinedEpoque', () => {
  describe('accept', () => {
    it('normal case', () => {
      expect.assertions(4);
      const value: number = -35;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const pass: PassThroughEpoque<number> = PassThroughEpoque.of<number>(
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
      const epoque: CombinedEpoque<number> = CombinedEpoque.of<number>(pass, pass, pass);

      epoque.accept(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(false);
    });
  });

  describe('decline', () => {
    it('normal case', () => {
      expect.assertions(3);
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const pass: PassThroughEpoque<number> = PassThroughEpoque.of<number>(
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
      const epoque: CombinedEpoque<number> = CombinedEpoque.of<number>(pass, pass, pass);

      epoque.decline();

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

      const pass: PassThroughEpoque<number> = PassThroughEpoque.of<number>(
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
      const epoque: CombinedEpoque<number> = CombinedEpoque.of<number>(pass, pass, pass);

      epoque.throw(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
