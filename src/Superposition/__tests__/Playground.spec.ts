import sinon, { SinonSpy } from 'sinon';

import { playground } from '../Playground';
import { Superposition } from '../Superposition';

describe('Playground', () => {
  describe('done', () => {
    it('alive case', () => {
      const v: number = 2;
      const superposition: Superposition<number, Error> = playground<number, Error>(() => {
        return v;
      });

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get()).toBe(v);
    });

    it('dead case', () => {
      const e: Error = new Error();
      const superposition: Superposition<number, Error> = playground<number, Error>(() => {
        throw e;
      });

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: Error) => {
          spy2();
          expect(e).toBe(err);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
