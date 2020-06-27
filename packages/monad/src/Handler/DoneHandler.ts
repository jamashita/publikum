import { IRejectHandler } from './Interface/IRejectHandler';
import { IResolveHandler } from './Interface/IResolveHandler';

export class DoneHandler<F, R> implements IResolveHandler<F, 'DoneHandler'>, IRejectHandler<R, 'DoneHandler'> {
  public readonly noun: 'DoneHandler' = 'DoneHandler';
  private readonly resolve: IResolveHandler<F>;
  private readonly reject: IRejectHandler<R>;

  public static of<F, R>(resolve: IResolveHandler<F>, reject: IRejectHandler<R>): DoneHandler<F, R> {
    return new DoneHandler<F, R>(resolve, reject);
  }

  protected constructor(resolve: IResolveHandler<F>, reject: IRejectHandler<R>) {
    this.resolve = resolve;
    this.reject = reject;
  }

  public onResolve(resolve: F): Promise<void> {
    return this.resolve.onResolve(resolve);
  }

  public onReject(reject: R): Promise<void> {
    return this.reject.onReject(reject);
  }
}
