import sinon, { SinonSpy } from 'sinon';

import { MockError } from '@jamashita/publikum-object';
import { Resolve } from '@jamashita/publikum-type';

import { ReceivedHandler } from '../ReceivedHandler';

describe('ReceivedHandler', () => {
  describe('onResolve', () => {
    it('R given', () => {
      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const handler: ReceivedHandler<number, number> = ReceivedHandler.of<number, number>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

          return n - 1;
        },
        (n: number) => {
          spy2();
          expect(n).toBe(value - 1);
        },
        () => {
          spy3();
        }
      );

      handler.onResolve(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('Promise<R> given', async () => {
      const value: number = 101;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const handler: ReceivedHandler<number, number> = ReceivedHandler.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Promise.resolve<number>(n - 2);
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

        handler.onResolve(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
    });

    it('Error thrown', () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      const handler: ReceivedHandler<number, number> = ReceivedHandler.of<number, number>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);

          throw error;
        },
        () => {
          spy2();
        },
        (e: Error) => {
          spy3();
          expect(e).toBe(error);
        }
      );

      handler.onResolve(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });

    it('Promise<R> rejected', async () => {
      const value: number = 101;
      const error: MockError = new MockError();

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();

      await new Promise<void>((resolve: Resolve<void>) => {
        const handler: ReceivedHandler<number, number> = ReceivedHandler.of<number, number>(
          (n: number) => {
            spy1();
            expect(n).toBe(value);

            return Promise.reject<number>(error);
          },
          () => {
            spy2();

            resolve();
          },
          (e: Error) => {
            spy3();
            expect(e).toBe(error);

            resolve();
          }
        );

        handler.onResolve(value);
      });

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
      expect(spy3.called).toBe(true);
    });
  });
});
