import sinon, { SinonSpy } from 'sinon';

import { PassEpoque } from '../PassEpoque';

describe('PassEpoque', () => {
  describe('resolve', () => {
    it('normal case', () => {
      const value: number = -35;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const epoque: PassEpoque<number, number> = PassEpoque.of<number, number>(
        (v: number) => {
          spy1();
          expect(v).toBe(value);
        },
        () => {
          spy2();
        }
      );

      epoque.resolve(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });
  });

  describe('reject', () => {
    it('normal case', () => {
      const value: number = -35;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const epoque: PassEpoque<number, number> = PassEpoque.of<number, number>(
        () => {
          spy1();
        },
        (v: number) => {
          spy2();
          expect(v).toBe(value);
        }
      );

      epoque.reject(value);

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
