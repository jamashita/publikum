import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';
import { Resolve } from '@jamashita/publikum-type';

import { DisappearedHandler } from '../DisappearedHandler';

describe('DisappearedHandler', () => {
  describe('onReject', () => {
    it('R given', () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const handler: DisappearedHandler<number> = DisappearedHandler.of<number>(
        (err: Error) => {
          spy1();
          expect(err).toBe(error);

          return value - 1;
        },
        (n: number) => {
          spy2();
          expect(n).toBe(value - 1);
        },
        () => {
          spy3();
        }
      );

      handler.onReject(error);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('Promise<R> given', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const handler: DisappearedHandler<number> = DisappearedHandler.of<number>(
          (err: Error) => {
            spy1();
            expect(err).toBe(error);

            return Promise.resolve<number>(value - 2);
          },
          (n: number) => {
            spy2();
            expect(n).toBe(value - 2);

            resolve();
          },
          () => {
            spy3();

            resolve();
          }
        );

        handler.onReject(error);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('Error thrown', () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const handler: DisappearedHandler<number> = DisappearedHandler.of<number>(
        (err: Error) => {
          spy1();
          expect(err).toBe(error1);

          throw error2;
        },
        () => {
          spy2();
        },
        (e: Error) => {
          spy3();
          expect(e).toBe(error2);
        }
      );

      handler.onReject(error1);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('Promise<R> rejected', async () => {
      const error1: MockError = new MockError();
      const error2: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const handler: DisappearedHandler<number> = DisappearedHandler.of<number>(
          (err: Error) => {
            spy1();
            expect(err).toBe(error1);

            return Promise.reject<number>(error2);
          },
          () => {
            spy2();

            resolve();
          },
          (e: Error) => {
            spy3();
            expect(e).toBe(error2);

            resolve();
          }
        );

        handler.onReject(error1);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
