import { IRejectExecutor } from './Interface/IRejectExecutor';
import { IResolveExecutor } from './Interface/IResolveExecutor';

export class DoneExecutor<F, R> implements IResolveExecutor<F, 'DoneExecutor'>, IRejectExecutor<R, 'DoneExecutor'> {
  public readonly noun: 'DoneExecutor' = 'DoneExecutor';
  private readonly resolve: IResolveExecutor<F>;
  private readonly reject: IRejectExecutor<R>;

  public static of<F, R>(resolve: IResolveExecutor<F>, reject: IRejectExecutor<R>): DoneExecutor<F, R> {
    return new DoneExecutor<F, R>(resolve, reject);
  }

  protected constructor(resolve: IResolveExecutor<F>, reject: IRejectExecutor<R>) {
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
