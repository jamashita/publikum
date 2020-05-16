import sinon, { SinonSpy } from 'sinon';
import { MockError } from '../../Mock';
import { Alive } from '../Alive';
import { Dead } from '../Dead';

import { playground } from '../Playground';
import { Superposition } from '../Superposition';

describe('Playground', () => {
  describe('done', () => {
    it('alive case', () => {
      const v: number = 2;
      const superposition: Superposition<number, MockError> = playground<number, MockError>(() => {
        return v;
      });

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get()).toBe(v);
    });

    it('returns itself when Supplier returns Alive', () => {
      const v: number = 2;
      const superposition: Superposition<number, MockError> = playground<number, MockError>(() => {
        return Alive.of<number, MockError>(v);
      });

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get()).toBe(v);
    });

    it('returns itself when Supplier returns Dead', () => {
      const e: MockError = new MockError();
      const superposition: Superposition<number, MockError> = playground<number, MockError>(() => {
        return Dead.of<number, MockError>(e);
      });

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: MockError) => {
          spy2();
          expect(e).toBe(err);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('dead case', () => {
      const e: MockError = new MockError();
      const superposition: Superposition<number, MockError> = playground<number, MockError>(() => {
        throw e;
      });

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: MockError) => {
          spy2();
          expect(e).toBe(err);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
