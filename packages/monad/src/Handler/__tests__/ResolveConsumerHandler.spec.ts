import sinon, { SinonSpy } from 'sinon';

import { ResolveEpoque } from '../../Epoque/Interface/ResolveEpoque';
import { PassEpoque } from '../../Epoque/PassEpoque';
import { ResolveConsumerHandler } from '../ResolveConsumerHandler';

describe('ResolveConsumerHandler', () => {
  describe('onResolve', () => {
    it('sync', () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const epoque: ResolveEpoque<number> = PassEpoque.of<number, unknown>(
        (n: number) => {
          spy1();
          expect(n).toBe(value);
        },
        () => {
          spy2();
        }
      );
      const handler: ResolveConsumerHandler<number> = ResolveConsumerHandler.of<number>(epoque);

      handler.onResolve(value);

      expect(spy1.called).toBe(true);
      expect(spy2.called).toBe(false);
    });

    it('async', () => {
      const value: number = 10;

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const epoque: ResolveEpoque<number> = PassEpoque.of<number, unknown>(
        // eslint-disable-next-line @typescript-eslint/require-await
        async (n: number) => {
          spy1();
          expect(n).toBe(value);
        },
        // eslint-disable-next-line @typescript-eslint/require-await
        async () => {
          spy2();
        }
      );
      const handler: ResolveConsumerHandler<number> = ResolveConsumerHandler.of<number>(epoque);

      handler.onResolve(value);

      expect(spy1.called).toBe(true);
    });
  });
});
